import {
  Particle,
  ParticleBehavior,
  ConfigurableParticleOptions,
} from "../game-objects";
import { PatternConfigMap } from "../config/level-configs";

export interface PatternCreatorInput {
  particleCount: number;
  behaviors: ParticleBehavior[];
  options: ConfigurableParticleOptions;
  canvas: HTMLCanvasElement;
}

export interface IPattern {
  create(
    input: PatternCreatorInput,
    config: PatternConfigMap[keyof PatternConfigMap]
  ): Particle[];
}
