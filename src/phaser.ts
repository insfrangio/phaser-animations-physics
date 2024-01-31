import { FluffJumping } from "./scenes/FluffJumping";
import { GameScene } from "./scenes/GameScene";
import { GunShot } from "./scenes/GunShot";
import { GunShotCollision } from "./scenes/GunShotCollision";
import { ZombieScene } from "./scenes/Zombie";
import "phaser/plugins/spine/dist/SpinePlugin";

export const scenes = [
  GunShotCollision,
  GunShot,
  ZombieScene,
  FluffJumping,
  GameScene,
];

export const phaser = new Phaser.Game({
  backgroundColor: "#000000",
  type: Phaser.AUTO,
  parent: "game-container",
  scale: { mode: Phaser.Scale.FIT },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      // gravity: { y: 300 },
    },
  },
  plugins: {
    scene: [
      {
        key: "SpinePlugin",
        plugin: window.SpinePlugin,
        mapping: "spine",
      },
    ],
  },
  scene: scenes,
  dom: { createContainer: true },
});
