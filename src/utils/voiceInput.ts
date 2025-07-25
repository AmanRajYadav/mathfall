// Voice Input System for MathFall
// Uses Web Speech API for voice recognition

interface VoiceInputConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  confidence: number;
}

class VoiceInputManager {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private config: VoiceInputConfig;

  constructor(config: Partial<VoiceInputConfig> = {}) {
    this.config = {
      language: 'en-US',
      continuous: true,
      interimResults: false,
      maxAlternatives: 1,
      confidence: 0.7,
      ...config
    };

    this.initializeSpeechRecognition();
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

  public startListening(onResult: (text: string) => void, onError?: (error: string) => void) {
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
    if (this.recognition && this.isListening) {
      this.recognition.stop();
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