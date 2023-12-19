import Phaser from "phaser";

export class GunShot extends Phaser.Scene {
  private ball!: Phaser.Physics.Arcade.Sprite;
  private cannon!: Phaser.GameObjects.Image;
  private line!: Phaser.Geom.Line;
  private graphics!: Phaser.GameObjects.Graphics;
  private angle = 0;
  constructor() {
    super({ key: "gun-shot" });
  }

  public preload() {
    this.load.image("ball", "asset/img/ball.png");
    this.load.image("cannon", "asset/img/arma.png");
  }

  public create() {
    this.createCannon();
    this.createBall();
    this.createLine();

    this.onPointerMove();
    this.onPointerDown();
  }

  private createLine() {
    const graphics = this.add.graphics({
      lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 },
    });
    const line = new Phaser.Geom.Line();

    this.graphics = graphics;
    this.line = line;
  }
  private createCannon() {
    const cannon = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height - 50,
      "cannon"
    );
    cannon.setDepth(1);
    this.cannon = cannon;
  }

  private createBall() {
    const ball = this.physics.add.sprite(
      this.cannon.x,
      this.cannon.y - 50,
      "ball"
    );
    ball.setScale(0.2);

    this.physics.world.disable(ball);

    this.ball = ball;
  }

  private onPointerMove() {
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.angle = Phaser.Math.Angle.BetweenPoints(this.cannon, pointer);
      this.cannon.rotation = this.angle + Math.PI / 2;
      Phaser.Geom.Line.SetToAngle(
        this.line,
        this.cannon.x,
        this.cannon.y,
        this.angle,
        200
      );
      this.graphics.clear().strokeLineShape(this.line);
    });
  }

  private onPointerDown() {
    this.input.on("pointerdown", () => {
      this.physics.world.enable(this.ball);
      this.ball.enableBody(true, this.cannon.x, this.cannon.y - 50, true, true);
      this.physics.velocityFromRotation(
        this.angle,
        600,
        this.ball.body?.velocity
      );
    });
  }
}
