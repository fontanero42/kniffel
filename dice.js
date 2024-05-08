import { logger } from "./logger.js";

export const KNF={
 "MAX_POINTS": 6,
 "GENERATION": ["init", "first", "second", "third"],
 "TUPPLE_THRESHOLD":2
};

export function createDice() {
  let points = new Array(0, 0, 0, 0, 0);
  let complet = new Array(false, false,false,false,false);
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
  return { points, complet, generation, valor, roll, out };
}

export function createScorecard() {
  let card = Object.create(null);
//
//  threesome.score({points:[1,2,3,2,3]});
  function sumAll(points) {
    return  points.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  }
  return {card, sumAll};
}

export function createFigure(given,max, total) {
  let figure = Object.create(null);
  let valor = 0;
  const name=given;
  const maxValor=max;
  const sumFn=total;

  function  score(dice){
    this.valor = sumFn(dice.points);
    logger.debug(this,'score');
  }
  return {figure, score, name, valor, maxValor};
}



