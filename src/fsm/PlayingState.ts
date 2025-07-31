import { LevelState } from "./LevelState";
import { GameOverState } from "./GameOverState";
import { LevelCompleteState } from "./LevelCompleteState";
import { Player } from "../game-objects/Player";
import { Particle } from "../game-objects/Particle";
import { Guardian } from "../game-objects/Guardian";
import { LightingBehavior } from "../particle-behaviors";

export class PlayingState extends LevelState {
  public enter(): void {
    super.enter();
    this.game.timer.start();
    this.game.collisionManager.addEventListener(
      "particle-goal-collision",
      this.handleParticleGoalCollision
    );
  }

  public exit(): void {
    super.exit();
    this.game.collisionManager.removeEventListener(
      "particle-goal-collision",
      this.handleParticleGoalCollision
    );
  }

  protected onCollisionStart = (event: Event) => {
    super.onCollisionStart(event);
    const customEvent = event as CustomEvent;
    const { object1, object2, position1, position2 } = customEvent.detail;

    if (object1 instanceof Player || object2 instanceof Player) {
      this.game.soundManager.playSound("player-death");
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

    if (object1 instanceof Guardian || object2 instanceof Guardian) {
      const guardian = (
        object1 instanceof Guardian ? object1 : object2
      ) as Guardian;
      const other = object1 instanceof Guardian ? object2 : object1;
      if (other instanceof Particle) {
        guardian.handleCollision(other);
        const lightingBehavior = other.behaviorManager.findBehavior(
          (b): b is LightingBehavior => b instanceof LightingBehavior
        );
        if ((lightingBehavior as LightingBehavior)?.mode === "lightUp") {
          other.fillOpacity = 0.5;
        }
      }
    }
  };

  private handleParticleGoalCollision = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { particle, goal, position, goalPosition } = customEvent.detail;
    // this.game.soundManager.playSound("particle-goal-collision");
    particle.behaviorManager.handleCollision(
      particle,
      goal,
      position,
      goalPosition
    );
  };

  public update(deltaTime: number, time: number): void {
    super.update(deltaTime, time);
    const collidables = [
      this.game.player,
      ...this.game.particleManager.getParticles(),
      ...this.game.guardians,
    ];
    this.game.collisionManager.checkCollisions(collidables, this.game.goal);
    this.game.player.update(this.game.mouse);
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

  public draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.player.draw(ctx);
    this.game.guardians.forEach((g) => g.draw(ctx));
    this.game.uiManager.drawTimer(ctx);
  }
}
