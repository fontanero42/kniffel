import { createScorecard } from "./dice.js";
import { logger } from "./logger.js";
import { score } from "./sutils.js";

export function moveFactory(type, round, gstate, dice) {
  let move;
  switch (type) {
    case 'start':
      move = new NoOp(gstate);
      break;
    case 'dice':
     move = new Dice(round, gstate, dice);
      break;
    case 'score':
      move = new Score(round, gstate, dice);
      break;
    case 'chose':
      move = new Chose(round, gstate);
      break;
    case 'note':
      move = new Note(round, gstate);
      break;
    case 'yield':
      move = new Yield(round, gstate);
      break;
    case 'end':
      move = new End(round, gstate, 'finis');
      break;

    default:
      return null;
  }
  return move;
}

export class Move {
  constructor(round) {
    this.valor = 0;
    this.next = null;
    this.message = "";
    this.round = round;
  }

  log() {
    logger.debug(`round=${this.round} at=${this.message}`);
  }

  dispatch() {
    return this.next;
  }
}


export class NoOp extends Move {
    constructor(gstate) {
    super(0);
    super.message = "start";
    this.gstate = gstate;
  }

  execute() {
    super.log();
    }
}


export class Dice extends Move {
  constructor(round, gstate, dice) {
    super(round);
    super.message = "dice";
    this.gstate = gstate;
    this.dice = dice;
  }

  execute() {
    super.log();
    this.dice.roll();
//    logger.trace({points: `${this.gstate.dice}`, generation: `${this.gstate.dice.generation}`});
    return;
  }


}


export class Score extends Move {
  constructor(round, gstate, dice) {
    super(round);
    super.message = "score";
    this.gstate = gstate;
    this.dice = dice;
  }

  execute() {
    super.log();
    let card=createScorecard();
    card.lower={threeS:"",fourS:"",kniffel:""};
    score(this.dice,card);
    return;
  }

}


export class Chose extends Move {
  constructor(round, gstate) {
    super(round);
    super.message = "chose";
    this.gstate = gstate;
  }

  execute() {
    super.log();
    return;
  }

}


export class Note extends Move {
  constructor(round, gstate) {
    super(round);
    super.message = "note";
    this.gstate = gstate;
  }

  execute() {
    super.log();
    return;
  }

}

export class Yield extends Move {
  constructor(round, gstate) {
    super(round);
    super.message ="yield";
    this.gstate = gstate;
  }

  execute() {
    super.log();
    return;
  }

}

export class End extends Move {
  constructor(round, gstate, reason) {
    super(round);
    super.message = "end" + " " + reason;
    this.gstate = gstate;
  }

  execute() {
    super.log();
    logger.debug(this.message);
    return this.next;
  }
}
