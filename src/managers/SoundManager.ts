export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private playingSources: Map<string, AudioBufferSourceNode[]> = new Map();
  private gainNode: GainNode | null = null;
  private isMuted = true;
  private isStarted = false;

  // private isPaused = false;

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public start(): void {
    if (this.audioContext) {
      // If context already exists, just resume it if it's suspended.
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      return;
    }

    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = this.isMuted ? 0 : 1;
    this.isStarted = true;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getStarted(): boolean {
    return this.isStarted;
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : 1;
    }
  }

  public async loadSound(name: string, url: string): Promise<void> {
    if (this.soundBuffers.has(name) || !this.audioContext) {
      return;
    }
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.soundBuffers.set(name, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sound: ${name}`, error);
    }
  }

  public playSound(name: string, loop = false): void {
    if (!this.audioContext || !this.gainNode) {
      return;
    }
    const audioBuffer = this.soundBuffers.get(name);
    if (!audioBuffer) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = loop;
    source.connect(this.gainNode);
    source.start(0);

    if (!this.playingSources.has(name)) {
      this.playingSources.set(name, []);
    }
    this.playingSources.get(name)!.push(source);

    source.onended = () => {
      const sources = this.playingSources.get(name);
      if (sources) {
        const index = sources.indexOf(source);
        if (index > -1) {
          sources.splice(index, 1);
        }
      }
    };
  }

  public stopSound(name: string): void {
    const sources = this.playingSources.get(name);
    if (sources) {
      sources.forEach((source: AudioBufferSourceNode) => source.stop());
      this.playingSources.set(name, []);
    }
  }

  public stopAllSounds(): void {
    for (const sources of this.playingSources.values()) {
      sources.forEach((source: AudioBufferSourceNode) => source.stop());
    }
    this.playingSources.clear();
  }

  public pauseAllSounds(): void {
    // this.isPaused = true;
    if (this.audioContext) {
      this.audioContext.suspend();
    }
  }

  public resumeAllSounds(): void {
    // this.isPaused = false;
    if (this.audioContext) {
      this.audioContext.resume();
    }
  }

  public isPlaying(name: string): boolean {
    const sources = this.playingSources.get(name);
    return !!sources && sources.length > 0;
  }
}
