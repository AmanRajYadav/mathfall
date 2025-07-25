# 🎵 Audio Files for MathFall

## Dynamic Music System

Place your music files here according to the naming convention below. The game will automatically select appropriate music based on wave/level and game state.

### Required Music Files:

```
public/
  audio/
    cinematic-menu.mp3      ← Epic cinematic menu music (God of War/CoD style)
    background-music.mp3    ← Waves 1-3 (early game)
    wave4-music.mp3         ← Waves 4-6 (mid game)
    wave7-music.mp3         ← Waves 7-9 (late game) 
    boss-music.mp3          ← Wave 10+ (boss levels)
    gameover-music.mp3      ← Game over screen
    README.md              ← This file
```

### Music Style Guide:

**Cinematic Menu**: Epic orchestral/cinematic like God of War, Call of Duty, heavy and dramatic  
**Waves 1-3**: Upbeat electronic, 120-130 BPM  
**Waves 4-6**: More intense techno, 130-140 BPM  
**Waves 7-9**: High-energy EDM, 140-150 BPM  
**Wave 10+**: Epic boss music, dramatic orchestral electronic  
**Game Over**: Somber but not depressing, 100-110 BPM  

### Cinematic Menu Music Requirements:
- **Style**: Heavy orchestral, dramatic, epic (think God of War, Call of Duty intro)
- **Instruments**: Full orchestra, heavy percussion, brass sections
- **Mood**: Powerful, heroic, intense, cinematic
- **Examples**: Epic movie trailer music, AAA game menu themes
- **Duration**: 3-5 minutes with seamless loop point  

### Requirements:
- **Format**: MP3
- **Duration**: 2-5 minutes (will loop automatically)
- **Volume**: Pre-mixed at comfortable level
- **Quality**: 128kbps or higher

### Fallback System:
If any MP3 file is missing, the game will automatically generate synthesized music with appropriate tempo and mood for that game state.

### Recommended Sources:
- Royalty-free music: Pixabay, Freesound, YouTube Audio Library
- Creative Commons: ccMixter, Free Music Archive
- Game music generators: AIVA, Amper Music
- Original compositions with synthesizers