import { State } from "./State";
import { GameOverState } from "./GameOverState";
import { LevelCompleteState } from "./LevelCompleteState";
import { Player } from "../game-objects/Player";
import { Particle } from "../game-objects/Particle";
import { Guardian } from "../game-objects/Guardian";
import { LightingBehavior } from "../particle-behaviors";

export class PlayingState extends State {
  public enter(): void {
    this.game.timer.start();
    this.game.collisionManager.addEventListener(
      "collision",
      this.handleCollision
    );
    this.game.collisionManager.addEventListener(
      "particle-goal-collision",
      this.handleParticleGoalCollision
    );
  }

  public exit(): void {
    this.game.collisionManager.removeEventListener(
      "collision",
      this.handleCollision
    );
    this.game.collisionManager.removeEventListener(
      "particle-goal-collision",
      this.handleParticleGoalCollision
    );
  }

  private handleCollision = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { object1, object2, position1, position2 } = customEvent.detail;

    if (object1 instanceof Player || object2 instanceof Player) {
      const player = (object1 instanceof Player ? object1 : object2) as Player;
      const collidedObject = (object1 instanceof Player ? object2 : object1) as
        | Particle
        | Guardian;
      const collisionPosition = player === object1 ? position2 : position1;
      this.game.stateMachine.transitionTo(
        new GameOverState(this.game, collidedObject, collisionPosition)
      );
      return;
    }

    const p1 = object1 instanceof Particle ? object1 : null;
    const p2 = object2 instanceof Particle ? object2 : null;

    if (p1 && p2) {
      p1.behaviorManager.handleCollision(p1, p2, position1, position2);
      p2.behaviorManager.handleCollision(p2, p1, position2, position1);
    } else if (object1 instanceof Guardian || object2 instanceof Guardian) {
      const guardian = (
        object1 instanceof Guardian ? object1 : object2
      ) as Guardian;
      const other = object1 instanceof Guardian ? object2 : object1;
      if (other instanceof Particle) {
        guardian.handleCollision(other);
        // Specifically check for lighting behavior on guardian collision
        const lightingBehavior = other.behaviorManager.findBehavior(
          (b): b is LightingBehavior => b instanceof LightingBehavior
        );
        // Lights up the particle on guardian collision
        if ((lightingBehavior as LightingBehavior)?.mode === "lightUp") {
          other.fillOpacity = 0.5;
        }
      }
    }
  };

  private handleParticleGoalCollision = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { particle, goal, position, goalPosition } = customEvent.detail;
    particle.behaviorManager.handleCollision(
      particle,
      goal,
      position,
      goalPosition
    );
  };

  public update(deltaTime: number): void {
    const collidables = [
      this.game.player,
      ...this.game.particleManager.getParticles(),
      ...this.game.guardians,
    ];
    this.game.collisionManager.checkCollisions(collidables, this.game.goal);
    this.game.player.update(this.game.mouse);
    this.game.particleManager.update(deltaTime, this.game.time);
    this.game.guardians.forEach((guardian) =>
      guardian.update(deltaTime, this.game.time)
    );

    // Goal is reached! Level Complete!
    if (
      this.game.goal.update(
        this.game.ctx,
        this.game.player,
        deltaTime,
        this.game.time
      )
    ) {
      this.game.stateMachine.transitionTo(new LevelCompleteState(this.game));
      return;
    }
  }
}
