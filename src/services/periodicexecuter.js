import Logger from "./logger";
export default class PeriodicExecuter {
  /**
   * @param {String} name
   * @param {Number} updateInterval
   * @param {Function} callback
   * @param {any} context
   */
  constructor(name, updateInterval, callback, context) {
    this.logger = new Logger(this, name);
    this.updateInterval = updateInterval;
    this.callback = callback.bind(context);
    this.timer = null;
    this.lastTime = 0;
  }

  start() {
    let now = performance.now();
    let delay = now - this.lastTime;
    delay = delay < this.updateInterval ? delay : 0;
    this.lastTime = now - (this.updateInterval - delay);
    this.timer = setTimeout(() => this.run(), delay);
  }

  run() {
    let now = performance.now();
    let dt = now - this.lastTime;
    //divide by 1000 to call the update in seconds
    this.callback(dt / 1000);
    let timeTaken = performance.now() - now;
    let nextUpdateDelay = this.updateInterval - timeTaken;
    if (nextUpdateDelay < 0) {
      // this.logger.log(1, "update took extra", -nextUpdateDelay, "ms, updateInterval is", this.updateInterval, "ms");
      nextUpdateDelay = 0;
    }
    this.lastTime = now;
    this.timer = setTimeout(() => this.run(), nextUpdateDelay);
  }

  stop() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
