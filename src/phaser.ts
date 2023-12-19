import { FluffJumping } from "./scenes/FluffJumping";
import { GameScene } from "./scenes/GameScene";
import { GunShot } from "./scenes/GunShot";

export const scenes = [FluffJumping, GunShot, GameScene];

export const phaser = new Phaser.Game({
  backgroundColor: "#000000",
  type: Phaser.AUTO,
  parent: "game-container",
  scale: { mode: Phaser.Scale.FIT },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 300 },
    },
  },
  scene: scenes,
  dom: { createContainer: true },
});
