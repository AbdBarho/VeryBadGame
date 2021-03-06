import { LimitedAcc } from "../../ecs/Entity";
import System from "../../ecs/system/System";
import { limitMag } from "../../math/Math";

export default class AccelerationLimiter extends System {
  constructor() {
    super("AccelerationLimiter", ["acceleration", "maxAcceleration"]);
  }

  updateEntity(entity: LimitedAcc, dt: number) {
    limitMag(entity.acceleration, entity.maxAcceleration);
  }
}
