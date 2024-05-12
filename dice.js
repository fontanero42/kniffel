import { logger } from "./logger.js";

export const KNF={
 "MAX_POINTS": 6,
 "GENERATION": ["init", "first", "second", "third"],
 "TUPPLE_THRESHOLD":2
};

export function createDice() {
  let points = new Array(0, 0, 0, 0, 0);
  let generation = KNF.GENERATION[0];
  let valor = 0;

  function out(msg) {
    logger.debug({ dice: this }, msg);
  }

  function roll() {
    let dnew = points.map(() => Math.floor(Math.random() * KNF.MAX_POINTS) + 1);
    this.points = dnew;
    let i = KNF.GENERATION.indexOf(this.generation);
    this.generation = KNF.GENERATION[++i];
    logger.debug({ dice: this }, 'roll');

  }
  return { points, generation, valor, roll, out };
}

export function createScorecard() {
  let card = Object.create(null);
  let fullCardCb;
  let lower={threesome:0,foursome:0,kniffel:0, chance:0};

  function sumAll(points) {
    return  points.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  }

  function out(msg) {
    logger.debug({ card: this }, msg);
  }
  function register(callback) {
    this.fullCardCb = callback;
  }
  function scribe() {
    let full=true;
    for (const name of Object.getOwnPropertyNames(this.lower)) {
      if(this.lower[name]==0){
        full=false;
        break;
      }
    }
    if (full) this.fullCardCb();
    return;
  
  }

  return {card, lower, sumAll, register, out, scribe};
}

export function createFigure(given,max, total) {
  let figure = Object.create(null);
  
  let flag=new Array(false,false,false,false,false);
  let valor = 0;
  const name=given;
  const maxValor=max;
  const sumFn=total;

  function  score(dice,mask){
    this.valor = sumFn(dice.points);
    for (const [i,v] of dice.points.entries()) {
      if (v==mask)  this.flag[i]=true;
    }
    logger.debug(this,'score');
  }
  return {figure, score, flag,name, valor, maxValor};
}



