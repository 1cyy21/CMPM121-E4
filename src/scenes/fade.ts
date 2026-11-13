import Phaser from "phaser";

const leaving = new WeakSet<Phaser.Scene>();

export function fadeTo(scene: Phaser.Scene, key: string, data?: object): void {
  if (leaving.has(scene)) return;
  leaving.add(scene);
  scene.events.once("shutdown", () => leaving.delete(scene));
  scene.cameras.main.fadeOut(450, 4, 2, 12);
  scene.cameras.main.once("camerafadeoutcomplete", () => {
    scene.scene.start(key, data);
  });
}

export function isLeaving(scene: Phaser.Scene): boolean {
  return leaving.has(scene);
}
