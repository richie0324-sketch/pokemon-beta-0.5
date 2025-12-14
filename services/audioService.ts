class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  private isMuted: boolean = false;
  private currentBgmOscillators: OscillatorNode[] = [];
  private bgmInterval: number | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // Singleton pattern handled by export
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Default volume
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.4; 
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.6;
      this.sfxGain.connect(this.masterGain);

      this.isInitialized = true;
    } catch (e) {
      console.error("AudioContext not supported", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.3, this.ctx!.currentTime, 0.1);
    }
    return this.isMuted;
  }

  // --- SYNTHESIZER FUNCTIONS ---

  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number, output: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const envelope = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    envelope.gain.setValueAtTime(1, startTime);
    envelope.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(envelope);
    envelope.connect(output);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // --- SFX PRESETS ---

  playSfx(type: 'click' | 'correct' | 'incorrect' | 'attack' | 'damage' | 'throw' | 'catch' | 'run' | 'start') {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const now = this.ctx.currentTime;

    switch (type) {
      case 'click':
        this.playTone(800, 'square', 0.05, now, this.sfxGain!);
        break;
      
      case 'correct':
        // High pitched "Ding Ding"
        this.playTone(1200, 'square', 0.1, now, this.sfxGain!);
        this.playTone(1800, 'square', 0.2, now + 0.1, this.sfxGain!);
        break;

      case 'incorrect':
        // Low buzzing
        this.playTone(150, 'sawtooth', 0.2, now, this.sfxGain!);
        this.playTone(100, 'sawtooth', 0.3, now + 0.2, this.sfxGain!);
        break;

      case 'start':
        this.playTone(440, 'square', 0.1, now, this.sfxGain!);
        this.playTone(880, 'square', 0.4, now + 0.1, this.sfxGain!);
        break;

      case 'attack':
        // White noise burst
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(1, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        noise.connect(noiseGain);
        noiseGain.connect(this.sfxGain!);
        noise.start(now);
        noise.stop(now + 0.2);
        break;

      case 'throw':
        // Slide up pitch
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.3);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'catch':
        // Victory fanfare snippet
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            this.playTone(freq, 'square', 0.1, now + (i * 0.1), this.sfxGain!);
        });
        break;
        
      case 'damage':
        // Slide down pitch
        const dOsc = this.ctx.createOscillator();
        const dGain = this.ctx.createGain();
        dOsc.type = 'sawtooth';
        dOsc.frequency.setValueAtTime(300, now);
        dOsc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
        dGain.gain.setValueAtTime(0.5, now);
        dGain.gain.linearRampToValueAtTime(0, now + 0.4);
        dOsc.connect(dGain);
        dGain.connect(this.sfxGain!);
        dOsc.start(now);
        dOsc.stop(now + 0.4);
        break;
    }
  }

  // --- BGM ENGINE ---

  stopBgm() {
    if (this.bgmInterval) {
      window.clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgmOscillators.forEach(o => {
        try { o.stop(); } catch(e) {}
    });
    this.currentBgmOscillators = [];
  }

  playBgm(type: 'menu' | 'menu_alt' | 'battle' | 'battle_alt' | 'legendary' | 'victory' | 'rescue') {
    if (!this.ctx || this.isMuted) return;
    this.stopBgm();
    this.resume();

    let noteIndex = 0;
    
    // Simple sequence data: [Frequency, Duration (ms)]
    // We will loop this sequence
    let sequence: number[] = [];
    let speed = 200; // ms per note

    if (type === 'menu') {
        sequence = [261.63, 329.63, 392.00, 493.88]; 
        speed = 420;
    } else if (type === 'menu_alt') {
        sequence = [196.00, 246.94, 293.66, 392.00, 329.63, 246.94, 293.66, 196.00];
        speed = 380;
    } else if (type === 'battle') {
        sequence = [
            220.00, 220.00, 261.63, 220.00, 329.63, 220.00, 392.00, 329.63,
            440.00, 440.00, 493.88, 440.00, 523.25, 493.88, 440.00, 392.00,
            220.00, 0, 220.00, 0, 261.63, 220.00, 196.00, 220.00
        ]; 
        speed = 130;
    } else if (type === 'battle_alt') {
        sequence = [
            174.61, 196.00, 233.08, 261.63, 233.08, 196.00, 174.61, 0,
            329.63, 349.23, 392.00, 440.00, 392.00, 349.23, 329.63, 0
        ];
        speed = 140;
    } else if (type === 'legendary') {
        sequence = [
            329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25,
            392.00, 440.00, 329.63, 261.63, 329.63, 392.00, 523.25, 659.25
        ];
        speed = 110;
    } else if (type === 'victory') {
        sequence = [523.25, 523.25, 659.25, 783.99, 523.25, 783.99, 1046.50, 1046.50, 0, 0];
        speed = 150;
    } else if (type === 'rescue') {
        sequence = [261.63, 293.66, 329.63, 293.66, 392.00, 329.63, 261.63, 329.63];
        speed = 520;
    }

    const playNextNote = () => {
        if (!this.ctx || this.isMuted) return;
        
        const freq = sequence[noteIndex % sequence.length];
        
        // --- 1. Main Melody Voice ---
        if (freq > 0) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            const isBattleLike = type === 'battle' || type === 'battle_alt' || type === 'legendary';
            osc.type = isBattleLike ? 'sawtooth' : (type === 'menu' || type === 'menu_alt' || type === 'rescue' ? 'triangle' : 'square');
            osc.frequency.value = freq;
            
            // Short decay for "plucky" sound
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (speed / 1000));
            
            osc.connect(gain);
            gain.connect(this.bgmGain!);
            
            osc.start();
            osc.stop(this.ctx.currentTime + (speed / 1000));
            
            this.currentBgmOscillators.push(osc);
        }

        // --- 2. Bass/Harmony Voice (For Battle Only) ---
        // Adds complexity by playing a bass note every 4th tick or harmony
        if (type === 'battle' || type === 'battle_alt' || type === 'legendary') {
             // Simple bassline logic: Follow root notes (A -> F -> G -> A) roughly mapping to sequence index
             let bassFreq = 0;
             const phase = noteIndex % 32;
             
             if (noteIndex % 2 === 0) { // Play bass on every other beat
                 if (phase < 8) bassFreq = 110.00; // A2
                 else if (phase < 16) bassFreq = 130.81; // C3
                 else if (phase < 24) bassFreq = 87.31; // F2
                 else bassFreq = 98.00; // G2
                 if (type === 'legendary') {
                    bassFreq *= 1.5;
                 }
             }

             if (bassFreq > 0) {
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                bassOsc.type = 'square'; // Bass is square wave
                bassOsc.frequency.value = bassFreq;
                
                bassGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                bassGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + (speed * 2 / 1000)); // Longer sustain
                
                bassOsc.connect(bassGain);
                bassGain.connect(this.bgmGain!);
                bassOsc.start();
                bassOsc.stop(this.ctx.currentTime + (speed * 2 / 1000));
                
                this.currentBgmOscillators.push(bassOsc);
             }
        }

        noteIndex++;

        // Cleanup old oscillators array periodically
        if (this.currentBgmOscillators.length > 20) {
            // Remove stopped ones from array tracking (mostly for GC reference dropping)
            this.currentBgmOscillators = this.currentBgmOscillators.slice(-10);
        }
    };

    playNextNote(); // Play first immediately
    this.bgmInterval = window.setInterval(playNextNote, speed);
  }
}

export const audioService = new AudioService();