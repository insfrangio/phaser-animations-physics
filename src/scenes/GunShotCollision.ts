import Phaser from "phaser";

export class GunShotCollision extends Phaser.Scene {
  private ball!: Phaser.Physics.Arcade.Sprite;
  private cannon!: Phaser.GameObjects.Image;
  private zombie!: Phaser.GameObjects.Image;
  private zombieDog!: Phaser.GameObjects.Image;
  private line!: Phaser.Geom.Line;
  private graphics!: Phaser.GameObjects.Graphics;
  private angle = 0;

  private isPressed = false;
  constructor() {
    super({ key: "gun-shot-collision" });
  }

  public preload() {
    this.load.image("ball", "asset/img/ball.png");
    this.load.image("cannon", "asset/img/arma.png");
    this.load.image("zombie", "asset/zombie/zombie_3.png");
    this.load.image("zombieDog", "asset/zombie/zombie_1.png");
  }

  public create() {
    this.createCannon();
    this.createBall();
    this.createLine();
    this.createZombie();
    this.createZombieDog();
    this.createGroupSprite();

    this.onPointerMove();
    this.onPointerDown();
  }

  public update() {
    this.physics.overlap(this.ball, this.zombie, (ball, zombie) => {
      if (this.isPressed) {
        zombie.destroy();
      }
      // ball.destroy();
    });
  }

  private createGroupSprite() {
    const zombie = this.physics.add.group({
      key: "zombie",
      frameQuantity: 5,
    });

    const children = zombie.getChildren();

    for (let i = 0; i < children.length; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      children[i].setPosition(x, y);
      children[i].setInteractive({ useHandCursor: true });
    }

    zombie.children.iterate((child) => {
      child.on("pointerdown", () => {
        console.log("click en esta mierda", child);
        this.isPressed = true;
      });
    });

    this.physics.add.overlap(this.ball, zombie, (ball, zombie) => {
      console.log("colision", ball, zombie);
      if (this.isPressed) {
        zombie.destroy();
      }
    });
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

  private createZombie() {
    const zombie = this.physics.add.image(200, 200, "zombie");

    this.physics.world.enable(zombie);

    zombie.setInteractive({ useHandCursor: true });

    // zombie.on(
    //   "pointerdown",
    //   () => {
    //     console.log("pointer");
    //     if (!this.isPressed) {
    //       this.isPressed = true;
    //     }
    //   },
    //   this
    // );

    this.zombie = zombie;
  }

  private createZombieDog() {
    const zombie = this.physics.add.image(400, 400, "zombieDog");

    zombie.setScale(0.5);

    this.zombieDog = zombie;
  }

  private createBall() {
    const ball = this.physics.add.sprite(
      this.cannon.x,
      this.cannon.y - 50,
      "ball"
    );
    ball.setScale(0.2);

    ball.setCollideWorldBounds(true, 1, 1, true);

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
      // this.physics.world.enable(this.ball);
      this.ball.enableBody(true, this.cannon.x, this.cannon.y - 50, true, true);
      this.physics.velocityFromRotation(
        this.angle,
        600,
        this.ball.body?.velocity
      );
    });
  }
}
