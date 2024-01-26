import Phaser from "phaser";

export class ZombieScene extends Phaser.Scene {
  private ball!: Phaser.Physics.Arcade.Sprite;
  private cannon!: Phaser.GameObjects.Image;
  private line!: Phaser.Geom.Line;
  private graphics!: Phaser.GameObjects.Graphics;
  private angle = 0;
  constructor() {
    super({ key: "undead-profit" });
  }

  public preload() {
    this.load.image("ball", "asset/img/ball.png");
    this.load.image("cannon", "asset/img/arma.png");

    this.load.image("cerca_baixo", "asset/zombie/cerca_baixo.png");
    this.load.image("cerca_cima", "asset/zombie/cerca_cima.png");
    this.load.image("bg", "asset/zombie/bg.png");

    this.load.image("zombie1", "asset/zombie/zombie_1.png");

    this.load.spine(
      "zombieSpine",
      "asset/zombie/test_spine/zombie_1_test.json",
      ["asset/zombie/test_spine/zombie_1_test.atlas"],
      true
    );

    this.load.spine(
      "boySpine",
      "asset/zombie/boy_spine/spineboy.json",
      ["asset/zombie/boy_spine/spineboy.atlas"],
      true
    );

    this.load.multiatlas(
      "zombie_sprite",
      "asset/zombie/test_sprite/zombie_test.json",
      "asset/zombie/test_sprite/"
    );
  }

  public create() {
    // this.createBackground();
    this.createSpriteSheet();
    // this.createSpine();
    // this.createCannon();
    // this.createBall();
    // this.createLine();
    // this.onPointerMove();
    // this.onPointerDown();

    const text = this.add.text(100, 100, "0 FPS", {
      fontSize: 32,
    });

    setInterval(() => {
      // console.log();
      text.setText(String(this.game.loop.actualFps));
    }, 1000);
  }

  private createSpriteSheet() {
    let middle = 400;
    let columns = 8;
    let perRow = 62; // 62
    let scale = 0.01;
    let moveX = 200 * scale;
    let moveY = 300;

    const configLoop3 = {
      key: "loop",
      frames: this.anims.generateFrameNumbers("zombie_sprite", {
        // frames: [0, 1, 2, 3],
        start: 0,
        end: 47,
      }),
      frameRate: 30,
      repeat: -1,
    };

    this.anims.create(configLoop3);

    for (let col = 0; col < columns; col++) {
      this.add.sprite(middle, moveY, "flower").setScale(scale);

      for (let row = 1; row < perRow / 2; row++) {
        let x = middle + row * moveX;

        const sprite = this.add.sprite(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          "zombie_sprite"
        );

        sprite.play("loop");
        sprite.setPosition(x, moveY);
        sprite.setScale(scale);
      }

      for (let row = 1; row < perRow / 2; row++) {
        let x = middle - row * moveX;

        const sprite = this.add.sprite(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          "zombie_sprite"
        );

        sprite.play("loop");
        sprite.setPosition(x, moveY);
        sprite.setScale(scale);
      }

      scale += 0.025;
      moveX = 200 * scale;
      moveY += 300 * scale;
      perRow -= 4;
    }

    // sprite.play("zombie_sprite");
  }

  private createSpine() {
    let middle = 400;
    let columns = 8;
    let perRow = 62; // 62
    let scale = 0.01;
    let moveX = 200 * scale;
    let moveY = 300;

    for (let col = 0; col < columns; col++) {
      this.add.sprite(middle, moveY, "flower").setScale(scale);

      for (let row = 1; row < perRow / 2; row++) {
        let x = middle + row * moveX;

        const zombie1 = this.add.spine(
          400,
          600,
          "zombieSpine",
          "animation",
          true
        );
        zombie1.setPosition(x, moveY);
        zombie1.setScale(scale);
      }

      for (let row = 1; row < perRow / 2; row++) {
        let x = middle - row * moveX;

        const zombie1 = this.add.spine(
          400,
          600,
          "zombieSpine",
          "animation",
          true
        );
        zombie1.setPosition(x, moveY);
        zombie1.setScale(scale);
      }

      scale += 0.025;
      moveX = 200 * scale;
      moveY += 300 * scale;
      perRow -= 4;
    }

    // const arr = Array.from({ length: 15 }, (_, i) => i + 1);

    // arr.forEach((_, idx) => {
    //   const zombie1 = this.add.spine(
    //     400,
    //     600,
    //     "zombieSpine",
    //     "animation",
    //     true
    //   );

    //   zombie1.setPosition(500 + idx * 20, 300 + idx * 20);
    //   zombie1.setScale(0.1);
    // });
    // const zombie1 = this.add.spine(400, 600, "zombieSpine", "animation", true);

    // zombie1.setPosition(500, 300);
    // zombie1.setScale(0.1);
  }

  private createBackground() {
    const background = this.add.image(0, 0, "bg");
    background.setScale(0.535);
    background.setPosition(510, 380);

    const cercaUp = this.add.image(0, 0, "cerca_cima");
    cercaUp.setScale(0.535, 0.4);
    cercaUp.setPosition(514, 160);

    const cercaDown = this.add.image(0, 0, "cerca_baixo");
    cercaDown.setScale(0.535, 0.4);
    cercaDown.setPosition(514, 625);
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
