import { accelerationPerSecond } from "../../engine/math/Math";
export default {
  WORLD: {
    SIZE: { x: 1920, y: 1080 }
  },
  SYSTEMS: {
    MOUSE_FOLLOWER_SYSTEM: {
      USE_MOUSE: false,
      IS_FROZEN: false,
      STOP_ON_REACH: false,
      DESTROY_ON_REACH: false,
      RESPAWN_ON_DESTROY: true,
      LOOK_AHEAD_STEPS: 0,
      RANDOM_FACTOR_SCALE: 10,
      ACCELERATION_SCALE: accelerationPerSecond(1500)
    }
  }
};
