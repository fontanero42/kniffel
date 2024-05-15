import { logger } from "./logger.js";

export const KNF = {
  "MAX_POINTS": 6,
  "GENERATION": ["first", "second", "third"],
  "TUPPLE_THRESHOLD": 2
};

export function createDice() {
  let points = new Array(0, 0, 0, 0, 0);
  let mask = new Array(0, 0, 0, 0, 0);
  let generation = KNF.GENERATION[0];
  let valor = 0;
  let xtrTryCb;
  function out(msg) {
    logger.trace({ dice: this }, msg);
  }

  function roll() {
    let dnew = points.map(() => Math.floor(Math.random() * KNF.MAX_POINTS) + 1);
    this.points = dnew;
    logger.trace({ dice: this }, 'roll');
  }
  function reroll() {
    let that=this;
    let dnew = points.map(() => Math.floor(Math.random() * KNF.MAX_POINTS) + 1);
    let dmerge1 = this.points.map((val, idx) =>that.mask[idx]*val);     
    let dmerge2 = dnew.map((val, idx) =>!that.mask[idx]*val);     
    this.points=dmerge1.map((val, idx) =>dmerge2[idx]+val);
  }
  function advance() {
    let i = KNF.GENERATION.indexOf(this.generation);
    if (this.generation == KNF.GENERATION[KNF.GENERATION.length])
      this.xtrTryCb();
    else
     this.generation = KNF.GENERATION[++i];
    logger.trace({ dice: this }, 'advance');
    }
  function reset() {
    this.generation = KNF.GENERATION[0];
    this.points = new Array(0, 0, 0, 0, 0);
    this.mask  = new Array(0, 0, 0, 0, 0);
    this.valor = 0;
    this.xtrTryCb();
  }
  function register(callback) {
    this.xtrTryCb = callback;
  }
  return { points, generation, mask, valor, reset, roll, reroll, advance, register, out };
}

export function createScorecard() {
  let card = Object.create(null);
  let fullCardCb;
  let lower = { threesome: 0, foursome: 0, kniffel: 0, chance: 0 };

  function sumAll(points) {
    return points.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  }
  function fix50() {
    return 50;
  }
  function out(msg) {
    logger.trace({ card: this }, msg);
  }
  function register(callback) {
    this.fullCardCb = callback;
  }
  function scribe() {
    let full = true;
    for (const name of Object.getOwnPropertyNames(this.lower)) {
      if (this.lower[name] == 0) {
        full = false;
        break;
      }
    }
    if (full) this.fullCardCb();
    return;

  }
  function strike(name) {
    this.lower[name] = -1;
  }
  return { card, lower, sumAll, fix50, register, out, scribe, strike };
}

export function createFigure(given, max, total) {
  let figure = Object.create(null);

  let flag = new Array(0, 0, 0, 0, 0);
  let valor = 0;
  const name = given;
  const maxValor = max;
  const sumFn = total;

  function score(dice, mask) {
    this.valor = sumFn(dice.points);
    for (const [i, v] of dice.points.entries()) {
      if (v == mask) this.flag[i] = 1;
    }
    logger.trace(this, 'score');
  }
  function selected(dice){
    dice.mask = this.flag;                                                                                        
  }
  return { figure, score, selected, flag, name, valor, maxValor };
}



