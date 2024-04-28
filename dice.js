import { logger } from "./logger.js";
  
export function createDice() {
    let points = new Array(0,0,0,0,0);
    points.init = function () {
      this.generation='first';
      this.valor=0;
    }
    points.log = function () {
      logger.debug(`dice=${this.points}`);
    }
    points.init();
    return points;
}
  