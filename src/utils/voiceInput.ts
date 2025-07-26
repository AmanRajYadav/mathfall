// Voice Input System for MathFall
// Enhanced with Gemini 2.5 Flash Native Audio Dialog for audio-to-text

interface VoiceInputConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  confidence: number;
  useGemini: boolean;
  geminiApiKey?: string;
}

class VoiceInputManager {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private config: VoiceInputConfig;
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;

  constructor(config: Partial<VoiceInputConfig> = {}) {
    this.config = {
      language: 'en-US',
      continuous: true,
      interimResults: false,
      maxAlternatives: 1,
      confidence: 0.7,
      useGemini: false,
      ...config
    };

    if (this.config.useGemini && this.config.geminiApiKey) {
      this.initializeGeminiAudio();
    } else {
      this.initializeSpeechRecognition();
    }
  }

  private initializeSpeechRecognition() {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognitionSettings();
    this.setupEventListeners();
  }

  private setupRecognitionSettings() {
    if (!this.recognition) return;

    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
  }

  private setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      this.isListening = true;
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.isListening = false;
    };

    this.recognition.onresult = (event) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim();
        const confidence = lastResult[0].confidence;
        
        console.log(`Voice input: "${transcript}" (confidence: ${confidence})`);
        // Only process if confidence is high enough
        if (confidence >= this.config.confidence) {
          // Extract numbers from speech
          const processedInput = this.processVoiceInput(transcript);
          if (processedInput && this.onResultCallback) {
            this.onResultCallback(processedInput);
          }
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
      this.isListening = false;
    };
  }

  private processVoiceInput(transcript: string): string | null {
    // Convert speech to numbers
    const text = transcript.toLowerCase().replace(/[.,!?]/g, '');
    
    // Handle common number words
    const numberWords: Record<string, string> = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
      'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
      'eighteen': '18', 'nineteen': '19', 'twenty': '20',
      'thirty': '30', 'forty': '40', 'fifty': '50', 'sixty': '60',
      'seventy': '70', 'eighty': '80', 'ninety': '90',
      'hundred': '100', 'thousand': '1000'
    };

    // Simple number extraction - handle basic cases first
    let processedText = text;
    
    // Replace number words with digits
    Object.entries(numberWords).forEach(([word, digit]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      processedText = processedText.replace(regex, digit);
    });

    // Extract just the numbers from the processed text
    const numbers = processedText.match(/\\d+/g);
    
    if (numbers && numbers.length > 0) {
      // For math problems, usually we want the final calculated result
      // For now, return the last number found
      return numbers[numbers.length - 1];
    }

    // Try to extract raw numbers from original transcript
    const rawNumbers = transcript.match(/\\d+/g);
    if (rawNumbers && rawNumbers.length > 0) {
      return rawNumbers[rawNumbers.length - 1];
    }

    return null;
  }

  private async initializeGeminiAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private async startGeminiAudioCapture(onResult: (text: string) => void, onError?: (error: string) => void) {
    if (!this.config.geminiApiKey) {
      const error = 'Gemini API key not provided';
      console.error(error);
      if (onError) onError(error);
      return false;
    }

    try {
      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create processor for audio data
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      // Connect WebSocket to Gemini Live API
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.config.geminiApiKey}`;
      
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('Connected to Gemini Live API');
        this.isListening = true;
        
        // Send initial setup message
        const setupMessage = {
          setup: {
            model: "models/gemini-2.5-flash-preview-native-audio-dialog",
            generation_config: {
              response_modalities: ["TEXT"],
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: "Aoede"
                  }
                }
              }
            },
            system_instruction: {
              parts: [{
                text: "You are a math problem solver. Listen to audio input and extract mathematical answers as numbers only. For example, if someone says 'fifteen plus seven equals twenty-two', respond with just '22'. Only respond with the final numerical answer."
              }]
            }
          }
        };
        
        this.websocket?.send(JSON.stringify(setupMessage));
      };

      this.websocket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          if (response.candidates && response.candidates[0]?.content?.parts) {
            const textPart = response.candidates[0].content.parts.find((part: any) => part.text);
            if (textPart && textPart.text.trim()) {
              const extractedNumber = this.extractNumberFromGeminiResponse(textPart.text.trim());
              if (extractedNumber && onResult) {
                onResult(extractedNumber);
              }
            }
          }
        } catch (error) {
          console.error('Error parsing Gemini response:', error);
        }
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError('Connection error');
        this.isListening = false;
      };

      this.websocket.onclose = () => {
        console.log('WebSocket connection closed');
        this.isListening = false;
      };

      // Process audio data
      this.processor.onaudioprocess = (event) => {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
          const inputBuffer = event.inputBuffer.getChannelData(0);
          
          // Convert to 16-bit PCM
          const pcmData = this.convertToPCM16(inputBuffer);
          
          // Send audio data to Gemini
          const audioMessage = {
            realtime_input: {
              media_chunks: [{
                mime_type: "audio/pcm;rate=16000",
                data: this.arrayBufferToBase64(pcmData)
              }]
            }
          };
          
          this.websocket.send(JSON.stringify(audioMessage));
        }
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      return true;
    } catch (error) {
      console.error('Error starting Gemini audio capture:', error);
      if (onError) onError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  private convertToPCM16(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    
    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, sample * 0x7FFF, true);
    }
    
    return buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private extractNumberFromGeminiResponse(text: string): string | null {
    // Extract numbers from Gemini's response
    const numbers = text.match(/\d+(\.\d+)?/g);
    if (numbers && numbers.length > 0) {
      return numbers[numbers.length - 1];
    }
    return null;
  }

  public startListening(onResult: (text: string) => void, onError?: (error: string) => void) {
    if (this.config.useGemini && this.config.geminiApiKey) {
      return this.startGeminiAudioCapture(onResult, onError);
    }

    if (!this.recognition) {
      const error = 'Speech recognition not available';
      console.error(error);
      if (onError) onError(error);
      return false;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) onError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  public stopListening() {
    if (this.config.useGemini) {
      // Stop Gemini audio capture
      if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
      }
      if (this.processor) {
        this.processor.disconnect();
        this.processor = null;
      }
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }
    } else {
      // Stop speech recognition
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
    }
    
    this.isListening = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public updateConfig(newConfig: Partial<VoiceInputConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.setupRecognitionSettings();
  }
}

// Global voice input manager instance
let voiceManager: VoiceInputManager | null = null;

export const getVoiceInputManager = (config?: Partial<VoiceInputConfig>): VoiceInputManager => {
  if (!voiceManager) {
    voiceManager = new VoiceInputManager(config);
  }
  return voiceManager;
};

export const isVoiceInputSupported = (): boolean => {
  const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  return !!SpeechRecognition;
};

export type { VoiceInputConfig };