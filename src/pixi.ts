import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";

export const app = new PIXI.Application({
  background: "#1099bb",
  resizeTo: window,
});

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
  const animations = PIXI.Assets.cache.get(
    "asset/pixijs/zombie_1_pixiJS/zombie_1_pixiJS.json"
  ).data.animations;

  const characters = [];

  const numberOfSprites = 500;

  for (let i = 0; i < numberOfSprites; i++) {
    const character = PIXI.AnimatedSprite.fromFrames(animations["z1"]);

    character.position.set(
      Math.random() * app.renderer.width,
      Math.random() * app.renderer.height
    );

    character.animationSpeed = 0.7;
    character.play();
    character.anchor.set(0.1);
    characters.push(character);
    character.scale.set(0.4);
  }

  app.stage.addChild(...characters);
};

const createAndAnimeSpine = () => {
  let characters: any = [];

  const numberOfSprites = 500;

  for (let i = 0; i < numberOfSprites; i++) {
    PIXI.Assets.load("asset/zombie/test_spine/zombie_1_test.json").then(
      (resource) => {
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
      }
    );
  }

  app.stage.addChild(...characters);
};

PIXI.Assets.load([
  "asset/pixijs/zombie_1_pixiJS/zombie_1_pixiJS.json",
  "asset/pixijs/zombie_1_pixiJS/zombie_1.png",

  "asset/zombie/test_spine/zombie_1_test.json",
  "asset/zombie/test_spine/zombie_1_test.png",
]).then(() => {
  // createAndAnimeSprite();
  // createAndAnimeSpine();
});
