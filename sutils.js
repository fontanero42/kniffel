import { logger } from "./logger.js";
import { createFigure, createScorecard } from "./dice.js";

export function score (dice,card) {
  findTuple(dice, card);
  dice.out("alea iacta est");
  return
}

export function findTuple(dice,card) {
  let second = dice.points.reduce((acc,val)=>{
    acc[val]=(acc[val]||0)+1;
    return  acc;
   },{} );
  //let second = Map.groupBy(dice.points,(value)=>value);
  let figure;
  for (const [key, value] of Object.entries(second)) {
  //for (const item of second) {
  //  let k =item[0];
  //  let l= item[1].length;
    switch (value) {
      case 1:
        //nothing
        figure = createFigure('build',0,card.sumAll);
        figure.score(dice);
        break;
      case 2:
        //build
        figure = createFigure('build',0,card.sumAll);
        figure.score(dice);
        break;
      case 3:
        //threesome
        figure = createFigure('threesome',30,card.sumAll);
        figure.score(dice);
        break;
      case 4:
        //foursome
        break;
      case 5:
        //kniffel
        break;
      default:
        logger.error("figure not found!");
    }
  }

  }
