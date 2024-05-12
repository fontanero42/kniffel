import { logger } from "./logger.js";
import { createFigure } from "./dice.js";

export function score(dice, card, options) {
  findTuple(dice, card, options);
  dice.out("alea iacta est");
  return
}

export function findTuple(dice, card, options) {
  let second = dice.points.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  //let second = Map.groupBy(dice.points,(value)=>value);
  let figure;
  for (const [key, value] of Object.entries(second)) {
    //for (const item of second) {
    //  let k =item[0];
    //  let l= item[1].length;
    switch (value) {
      case 1:
        //chance
        break;
      case 2:
        //build
        figure = createFigure('chance', 0, card.sumAll);
        figure.score(dice, key);
        options.push(figure);
        break;
      case 3:
        //threesome
        figure = createFigure('threesome', 30, card.sumAll);
        figure.score(dice, key);
        options.push(figure);
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
  if (options.length == 0) {
    figure = createFigure('chance', 0, card.sumAll);
    figure.score(dice, null);
    options.push(figure);
  }
  return options;
}
