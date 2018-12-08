import InputManager from "../../core/inputManager";
import EntityFactory from "./factory";
import ECS from "../../ecs/ecs";
import EmptySystem from "../../ecs/system/emptySystem";

export default class ExplosionOnClick extends EmptySystem {
  input: InputManager;
  ecs: ECS;
  constructor(input: InputManager, ecs: ECS) {
    super();
    this.ecs = ecs;
    this.input = input;
    this.update = this.doNothing;
  }

  init() {
    this.input.onKey("mousedown", this.handleKey, this);
  }

  handleKey(keyName: string) {
    if (keyName === "Mouse1")
      this.update = this.createExplosion;
  }

  createExplosion() {
    let explosion = EntityFactory.createExplosion();
    explosion.position.setVec(this.input.mousePos);
    this.ecs.queueEntity(explosion);
    //reset
    this.update = this.doNothing;
  }

  doNothing() {
    //nothing
  }

  destroy() {
    this.input.off("mousedown", this.handleKey);
  }

}