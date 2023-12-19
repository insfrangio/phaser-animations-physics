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

export class FluffJumping extends Phaser.Scene {
  private cannon!: Phaser.GameObjects.Image;
  private line!: Phaser.Geom.Line;
  private graphics!: Phaser.GameObjects.Graphics;
  private angle = 0;
  private previousRandomPosition: number | null = null;
  private isGenerating: boolean = false;
  private button!: ButtonText;
  private timedEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: "fluff-jumping" });
  }

  public preload() {
    this.load.image("ball", "asset/img/ball.png");
    this.load.image("cannon", "asset/img/arma.png");
    this.load.image("background", "asset/img/background.png");
  }

  public create() {
    this.createBackground();
    this.createCannon();
    this.createLine();
    this.createButton();

    this.onPointerMove();
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
  private createCannon() {
    const cannon = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height - 50,
      "cannon"
    );
    cannon.setDepth(1);
    this.cannon = cannon;
  }

  private createBall(ballX: number, ballY: number) {
    const ball = this.physics.add.sprite(ballX, ballY, "ball");
    ball.setScale(0.5);

    this.physics.world.enable(ball);
    ball.enableBody(true, ballX, ballY, true, true);

    return ball;
  }

  private startGenerate() {
    // this.time.delayedCall(TIME_TO_GENERATE, () => this.startGenerate())
    this.startAnimation();

    this.timedEvent = this.time.addEvent({
      delay: TIME_TO_GENERATE,
      callback: this.startAnimation,
      callbackScope: this,
      //  repeat: 10,
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

    const ball = this.createBall(ballX, ballY);

    const speed = 600;
    this.physics.velocityFromRotation(
      angleToCenter,
      speed,
      ball.body?.velocity
    );
  }

  private createButton() {
    const button = new ButtonText(this, 60, 30);

    button.onClick(() => {
      if (!this.isGenerating) {
        this.isGenerating = true;
        this.button?.setLabelButton("Stop");
        this.startGenerate();

        return;
      }

      this.timedEvent?.remove();
      this.isGenerating = false;
      this.button?.setLabelButton("Play Game");
    });

    this.button = button;
  }
}
