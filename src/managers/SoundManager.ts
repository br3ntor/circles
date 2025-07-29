export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext;
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private playingSources: Map<string, AudioBufferSourceNode[]> = new Map();

  private isPaused = false;

  private constructor() {
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public resumeAudioContext(): void {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  public async loadSound(name: string, url: string): Promise<void> {
    if (this.soundBuffers.has(name)) {
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
    const audioBuffer = this.soundBuffers.get(name);
    if (!audioBuffer) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = loop;
    source.connect(this.audioContext.destination);
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
    this.isPaused = true;
    this.audioContext.suspend();
  }

  public resumeAllSounds(): void {
    this.isPaused = false;
    this.audioContext.resume();
  }

  public isPlaying(name: string): boolean {
    const sources = this.playingSources.get(name);
    return !!sources && sources.length > 0;
  }
}
