import ECS from "../../../engine/ecs/ECS";
import EmptySystem from "../../../engine/ecs/system/Emptysystem";
import { InputProvider } from "../../../engine/Inputmanager";
import FlushBuffer from "../../../engine/systems/render/FlushBuffer";
import World from "../../WorldManager";
import Config from "../Config";
import Factory from "../services/Factory";
import MFSys from "./MouseFollowerSystem";
import Navigator from "./Navigator";

export default class InputSystem extends EmptySystem {
  input: InputProvider;
  level: ECS;
  system: MFSys;
  world: World;
  navigator: Navigator;
  buffer: FlushBuffer;
  slowMoScale = .12;

  constructor(input: InputProvider, level: ECS, system: MFSys, world: World,
    navigator: Navigator, buffer: FlushBuffer) {
    super("InputSystem");
    this.input = input;
    this.level = level;
    this.system = system;
    this.world = world;
    this.navigator = navigator;
    this.buffer = buffer;
  }

  init() {
    this.input.onKey("keydown", this.handleKey, this);
    this.input.onKey("mousedown", this.mouseDown, this);
    this.input.onKey("mouseup", this.mouseUp, this);
  }

  mouseDown(key: string) {
    if (key === "Mouse1") {
      const explosion = Factory.createExplosion();
      const scale = this.world.canvas.scale;
      explosion.position.x = this.input.mousePos.x * scale.x;
      explosion.position.y = this.input.mousePos.y * scale.y;

      this.level.queueEntity(explosion);
    }
    else if (key === "Mouse3")
      this.level.timeScale = this.slowMoScale;
  }

  mouseUp(key: string) {
    if (key === "Mouse3")
      this.level.timeScale = 1;
  }

  handleKey(keyName: string) {
    switch (keyName) {
      case "Enter":
        this.spawnMouseFollowers();
        break;
      case "Delete":
        this.removeMouseFollowers();
        break;
      case "Digit1":
        // normal
        this.setMFSysParams(false, false, true, 0, 0);
        break;
      case "Digit2":
        // go to mouse
        this.setMFSysParams(true, false, true, 200, 0);
        break;
      case "Digit3":
        // black hole
        this.setMFSysParams(false, true, true, 50, 0);
        break;
      case "Digit4":
        //random
        this.setMFSysParams(false, false, false, 0, 1);
        break;
      case "Digit5":
        //totally random
        this.setMFSysParams(false, false, false, 0, Config.SYSTEMS.MOUSE_FOLLOWER_SYSTEM.RANDOM_FACTOR_SCALE);
        break;
      case "Digit6":
        // freeze/unfreeze
        this.level.modifyEntities(["mouseFollower"], [], e => {
          if (e.isFrozen)
            delete e.isFrozen;
          else
            e.isFrozen = true;
        })
        break;
      case "Digit7":
        if (this.system.useMouse) {
          this.system.useMouse = false;
          this.system.setTarget(this.navigator.getCurrent())
        } else {
          this.system.useMouse = true;
          this.setMFSysParams(false, false, true, 0, 0);
          this.system.setTarget(this.input.mousePos);
        }
        break;
      case "ArrowUp":
        this.buffer.alpha = Math.min(this.buffer.alpha + 0.05, 1);
        break;
      case "ArrowDown":
        this.buffer.alpha = Math.max(this.buffer.alpha - 0.05, 0.15);
        break;
      default:
        break;
    }
  }

  setMFSysParams(stop: boolean, destroy: boolean, respawn: boolean, steps: number, randomScale: number) {
    this.system.stopOnReach = stop;
    this.system.destroyOnReach = destroy;
    this.system.respawnOnDestroy = respawn;
    this.system.lookAheadSteps = steps;
    this.system.randomFactorScale = randomScale;
    this.system.updateSubRoutines();
  }

  spawnMouseFollowers() {
    for (let i = 0; i < 100; i++)
      this.level.queueEntity(Factory.createMouseFollower());
    // Logger.debugInfo("Num mouseFollowers", Object.keys(this.system.entities).length + 100);
  }

  removeMouseFollowers() {
    let i = 100;
    for (let id in this.system.entities) {
      this.level.removeEntity(id);
      if (--i === 0)
        break;
    }
    // Logger.debugInfo("Num mouseFollowers", Object.keys(this.system.entities).length);
  }

  destroy() {
    this.input.off("keydown", this.handleKey);
    this.input.off("mousedown", this.mouseDown);
    this.input.off("mouseup", this.mouseUp);
  }

}
