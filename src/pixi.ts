import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";

export const app = new PIXI.Application({
  background: "#1099bb",
  resizeTo: window,
});

const ASSETS_COUNT_SPINE = Array.from(
  { length: 20 },
  (_, i) => `asset/zombie/test_spine${i + 1}/zombie_1_test.json`
);

export const randomNumbers = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// const webgl =

console.log(app.renderer.type);

const ticker = PIXI.Ticker.shared;
ticker.maxFPS = 60;

const $output = document.querySelector("#output");

ticker.add(() => {
  // @ts-ignore
  $output.innerText = `${ticker.FPS} fps`;
});

ticker.start();

const createAndAnimeSprite = () => {
  const zombieSprite = PIXI.Assets.cache.get(
    "asset/pixijs/zombie_1_pixiJS/zombie_1_pixiJS.json"
  ).data.animations;

  const wormSprite = PIXI.Assets.cache.get(
    "asset/pixijs/chicken-worm-bat/worm_pixiJS.json"
  ).data.animations;

  const chickenSprite = PIXI.Assets.cache.get(
    "asset/pixijs/chicken-worm-bat/chicken_pixiJS.json"
  ).data.animations;

  const batSprite = PIXI.Assets.cache.get(
    "asset/pixijs/chicken-worm-bat/bat_pixiJS.json"
  ).data.animations;

  const characters = [];

  const numberOfSprites = 500;

  for (let i = 0; i < numberOfSprites; i++) {
    const character = PIXI.AnimatedSprite.fromFrames(zombieSprite["z1"]);
    const worm = PIXI.AnimatedSprite.fromFrames(wormSprite["worm"]);
    const chicken = PIXI.AnimatedSprite.fromFrames(chickenSprite["chicken"]);
    const bat = PIXI.AnimatedSprite.fromFrames(batSprite["bat"]);

    character.position.set(
      Math.random() * app.renderer.width,
      Math.random() * app.renderer.height
    );

    worm.position.set(
      Math.random() * app.renderer.width,
      Math.random() * app.renderer.height
    );

    chicken.position.set(
      Math.random() * app.renderer.width,
      Math.random() * app.renderer.height
    );

    bat.position.set(
      Math.random() * app.renderer.width,
      Math.random() * app.renderer.height
    );

    character.animationSpeed = 0.7;
    character.play();

    worm.animationSpeed = 0.7;
    worm.play();

    chicken.animationSpeed = 0.7;
    chicken.play();

    bat.animationSpeed = 0.7;
    bat.play();

    character.anchor.set(0.1);
    worm.anchor.set(0.1);
    chicken.anchor.set(0.1);
    bat.anchor.set(0.1);

    characters.push(character);
    characters.push(worm);
    characters.push(chicken);
    characters.push(bat);

    character.scale.set(0.4);
    worm.scale.set(0.4);
    chicken.scale.set(0.4);
    bat.scale.set(0.4);
  }

  app.stage.addChild(...characters);
};

const createAndAnimeSpine = () => {
  let characters: any = [];

  const numberOfSprites = 500;

  for (let i = 0; i < numberOfSprites; i++) {
    PIXI.Assets.load(
      `asset/zombie/test_spine${randomNumbers(1, 20)}/zombie_1_test.json`
    ).then((resource) => {
      const animation = new Spine(resource.spineData);
      animation.position.set(
        Math.random() * app.renderer.width,
        Math.random() * app.renderer.height
      );
      animation.scale.set(0.2);
      app.stage.addChild(animation);

      if (animation.state.hasAnimation("animation")) {
        animation.state.setAnimation(0, "animation", true);
        animation.state.timeScale = 1;
        animation.autoUpdate = true;
      }
      characters = animation;
    });
  }

  app.stage.addChild(...characters);
};

PIXI.Assets.load([
  "asset/pixijs/zombie_1_pixiJS/zombie_1_pixiJS.json",
  "asset/pixijs/zombie_1_pixiJS/zombie_1.png",

  "asset/pixijs/chicken-worm-bat/worm_pixiJS.json",
  "asset/pixijs/chicken-worm-bat/worm.png",

  "asset/pixijs/chicken-worm-bat/chicken_pixiJS.json",
  "asset/pixijs/chicken-worm-bat/chicken.png",

  "asset/pixijs/chicken-worm-bat/bat_pixiJS.json",
  "asset/pixijs/chicken-worm-bat/bat.png",

  "asset/zombie/test_spine/zombie_1_test.json",
  "asset/zombie/test_spine/zombie_1_test.png",
  ...ASSETS_COUNT_SPINE,
]).then(() => {
  // createAndAnimeSprite();
  // createAndAnimeSpine();
});
