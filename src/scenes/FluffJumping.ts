import Phaser from "phaser";

class ButtonText extends Phaser.GameObjects.Container {
  private button!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.render();
  }

  private render() {
    this.createButton();
    this.addInteractive();
  }

  private createButton() {
    const button = this.scene.add
      .text(this.x, this.y, "Play Game", {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        backgroundColor: "#2d2d2d",
      })
      .setPadding(16)
      .setOrigin(0.5);

    this.add(button);

    this.button = button;
  }

  public setLabelButton(text: string) {
    this.button.setText(text);
  }

  private addInteractive() {
    this.button.setInteractive({ useHandCursor: true });

    this.button.on(
      "pointerover",
      (() => {
        this.button.setBackgroundColor("#8d8d8d");
      }).bind(this)
    );

    this.button.on(
      "pointerout",
      (() => {
        this.button.setBackgroundColor("#2d2d2d");
      }).bind(this)
    );
  }

  public onClick(callback: () => void) {
    this.button.on(
      "pointerdown",
      (() => {
        callback();
      }).bind(this)
    );
  }
}

const TIME_TO_GENERATE = 2000;

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export class FluffJumping extends Phaser.Scene {
  private cannon!: Phaser.GameObjects.Image;
  private line!: Phaser.Geom.Line;
  private graphics!: Phaser.GameObjects.Graphics;
  private angle = 0;
  private previousRandomPosition: number | null = null;
  private isGenerating: boolean = false;
  private button!: ButtonText;
  private timedEvent!: Phaser.Time.TimerEvent;
  private speed = 600;
  private toys!: Phaser.Physics.Arcade.Sprite;
  // private bullet!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({ key: "fluff-jumping" });
  }

  public preload() {
    this.load.image("ball", "asset/img/ball.png");
    this.load.image("cannon", "asset/img/arma.png");
    this.load.image("background", "asset/img/background.png");
    this.load.atlas("toys", "asset/toys.png", "asset/toys.json");
    this.load.image("bullet", "asset/img/bullet.png");
    this.load.atlas("bomb", "asset/bomb/bomb.png", "asset/bomb/bomb.json");
    this.load.atlas("hit", "asset/hit/hit.png", "asset/hit/hit.json");
    this.load.atlas(
      "hit_balloon",
      "asset/hit_balloon/hit_balloon.png",
      "asset/hit_balloon/hit_balloon.json"
    );
  }

  public create() {
    this.createFrames();
    this.createBackground();
    this.createCannon();
    this.createLine();
    this.createButtons();
    this.onPointerMove();
    this.onPointerDown();
  }

  private createBackground() {
    const screenHeight = this.game.config.height as number;
    const background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "background"
    );
    background?.setDisplaySize(background.width, screenHeight);
    background.setDepth(0);
  }

  private createLine() {
    const graphics = this.add.graphics({
      lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 },
    });
    const line = new Phaser.Geom.Line();

    this.graphics = graphics;
    this.line = line;
  }

  private createBullet() {
    const bullet = this.physics.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height - 100,
      "bullet"
    );

    this.physics.world.disable(bullet);

    bullet.setScale(0.4);

    return bullet;
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

  private createFrames() {
    this.anims.create({
      key: "hit",
      frames: this.anims.generateFrameNames("hit", {
        start: 0,
        end: 23,
      }),
      frameRate: 24,
      repeat: 0,
    });

    this.anims.create({
      key: "hit_balloon",
      frames: this.anims.generateFrameNames("hit_balloon", {
        start: 0,
        end: 23,
      }),
      frameRate: 24,
      repeat: 0,
    });

    this.anims.create({
      key: "bomb",
      frames: this.anims.generateFrameNames("bomb", {
        start: 0,
        end: 23,
      }),
      frameRate: 24,
      repeat: 0,
    });
  }

  private createToys(toysX: number, toysY: number) {
    const frame = `${generateRandomNumber(1, 7)}.png`;
    const toys = this.physics.add.sprite(toysX, toysY, "toys", frame);

    // detecta collision
    this.physics.world.enable(toys);

    const randomMass = generateRandomNumber(1, 5);
    toys.setMass(randomMass);

    const randomRotationDegrees = generateRandomNumber(-80, 80);
    const randomRotationRadians = Phaser.Math.DegToRad(randomRotationDegrees);

    toys.setRotation(randomRotationRadians);
    console.log("ue?");

    toys.setInteractive({ useHandCursor: true });
    toys.setScale(0.3);

    // toys.on("pointerdown", () => {
    //   this.physics.pause();
    //   console.log("Debuto con:", frame);
    //   this.stopAnimation();

    //   setTimeout(() => {
    //     this.runAnimation();
    //     this.physics.resume();
    //   }, 2000);
    // });
    toys.on("pointerdown", () => {
      const isBomb = generateRandomNumber(0, 1);
      const hitFrame =
        frame === "1.png" ? "hit_balloon" : !isBomb ? "hit" : "bomb";

      toys.setScale(0.4);

      this.physics.pause();
      toys.anims.play(hitFrame);

      toys.on("animationcomplete", () => {
        toys.destroy();
      });

      this.stopAnimation();

      setTimeout(() => {
        this.runAnimation();
        this.physics.resume();
      }, 1000);
    });

    this.physics.world.enable(toys);
    toys.enableBody(true, toysX, toysY, true, true);
    this.toys = toys;

    return toys;
  }

  private startGenerate() {
    this.startAnimation();

    this.timedEvent = this.time.addEvent({
      delay: TIME_TO_GENERATE,
      callback: this.startAnimation,
      callbackScope: this,
      loop: true,
    });
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

  private generateRandomPosition(): number {
    const randomPosition = Phaser.Math.Between(0, 5);

    if (randomPosition !== this.previousRandomPosition) {
      this.previousRandomPosition = randomPosition;
      return randomPosition;
    }

    return this.generateRandomPosition();
  }

  private startAnimation() {
    const screenWidth = this.game.config.width as number;
    const screenHeight = this.game.config.height as number;
    const positionWidth = screenWidth / 6;

    const randomPosition = this.generateRandomPosition();

    const ballX = positionWidth * randomPosition + positionWidth / 2;
    const ballY = screenHeight + 50;
    const centerX = screenWidth / 2;

    const centerY = screenHeight / 2;
    const angleToCenter = Phaser.Math.Angle.Between(
      ballX,
      ballY,
      centerX,
      centerY
    );

    const ball = this.createToys(ballX, ballY);

    // const speed = 600;
    this.physics.velocityFromRotation(
      angleToCenter,
      this.speed,
      ball.body?.velocity
    );

    const randomRotationDegrees = generateRandomNumber(-40, 40);

    this.tweens.add({
      targets: ball.body,
      angularVelocity: randomRotationDegrees,
      duration: 2000,
      ease: "Linear",
      // onComplete: () => {
      //   ball.destroy(); // Elimina el sprite después de la animación
      // },
    });
  }

  private startAnimationBullet() {
    const bullet = this.createBullet();

    this.physics.world.enable(bullet);
    bullet.enableBody(true, this.cannon.x, this.cannon.y - 50, true, true);
    this.physics.add.collider(bullet, this.toys, () => {
      this.toys.destroy();
      bullet.destroy();
    });
    this.physics.velocityFromRotation(this.angle, 600, bullet.body?.velocity);
  }

  private onPointerDown() {
    this.input.on("pointerdown", () => this.startAnimationBullet());
  }

  private runAnimation() {
    this.isGenerating = true;
    this.button?.setLabelButton("Stop");
    this.startGenerate();
  }

  private stopAnimation() {
    this.timedEvent?.remove();
    this.isGenerating = false;
    this.button?.setLabelButton("Play Game");
  }

  private createButtons() {
    const button = new ButtonText(this, 60, 30);

    button.onClick(() => {
      if (!this.isGenerating) {
        this.runAnimation();
        return;
      }

      this.stopAnimation();
    });

    this.button = button;
  }
}
