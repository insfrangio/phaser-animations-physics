import * as PIXI from "pixi.js";

export const app = new PIXI.Application({
  background: "#1099bb",
  resizeTo: window,
});

PIXI.Assets.load([
  "asset/pixijs/zombie_1_pixiJS/zombie_1_pixiJS.json",
  "asset/pixijs/zombie_1_pixiJS/zombie_1.png",
]).then(() => {
  const animations = PIXI.Assets.cache.get(
    "asset/pixijs/zombie_1_pixiJS/zombie_1_pixiJS.json"
  ).data.animations;

  const character = PIXI.AnimatedSprite.fromFrames(animations["z1"]);
  character.position.set(150, 180);

  character.animationSpeed = 0.7;
  character.position.set(150, 180);
  character.play();

  app.stage.addChild(character);
});
