import { logger } from "./logger.js";
import { score } from "./sutils.js";
import { chose, note } from "./cutils.js";
import { KNF, createDice } from "./dice.js";

export function moveFactory(type, gstate) {
  let move;
  switch (type) {
    case 'start':
      move = new NoOp(gstate);
      break;
    case 'dice':
     move = new Dice(gstate);
      break;
    case 'score':
      move = new Score(gstate);
      break;
    case 'chose':
      move = new Chose(gstate);
      break;
    case 'note':
      move = new Note(gstate);
      break;
    case 'yield':
      move = new Yield(gstate);
      break;
    case 'end':
      move = new End(gstate, 'finis');
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
    super(gstate.round);
    super.message = "start";
    this.gstate = gstate;
  }

  execute() {
    super.log();
    }
}


export class Dice extends Move {
  constructor(gstate) {
    super(gstate.round);
    super.message = "dice";
    this.gstate = gstate;
    this.dice = gstate.dice;
  }

  execute() {
    super.log();
    if (this.dice.generation==KNF.GENERATION[0]){
      this.dice.roll();
//    logger.trace({points: `${this.gstate.dice}`, generation: `${this.gstate.dice.generation}`});
     } else{
      this.dice.reroll(); 
    }
    return;
  }


}


export class Score extends Move {
  constructor(gstate) {
    super(gstate.round);
    super.message = "score";
    this.gstate = gstate;
    this.dice = gstate.dice;
    this.card = gstate.card;
    this.options = gstate.options;
  }

  execute() {
    super.log();
    score(this.dice,this.card,this.options);
    return;
  }

}


export class Chose extends Move {
  constructor(gstate) {
    super(gstate.round);
    super.message = "chose";
    this.gstate = gstate;
    this.dice = gstate.dice;
    this.card = gstate.card;
    this.options = gstate.options;
    this.choice = gstate.choice;
  }

  execute() {
    super.log();
    this.gstate.choice=chose(this.dice, this.card, this.options);
    this.options[this.gstate.choice].selected(this.dice);
    this.dice.advance();
      return; 
  }

}


export class Note extends Move {
  constructor(gstate) {
    super(gstate.round);
    super.message = "note";
    this.gstate = gstate;
    this.dice = gstate.dice;
    this.options = gstate.options;
    this.choice = gstate.choice;
    this.card = gstate.card;
  }

  execute() {
    super.log();
    note(this.dice, this.card, this.options[this.choice]);
    this.gstate.dice.reset();
    this.gstate.options =[];
    return;
  }

}

export class Yield extends Move {
  constructor(gstate) {
    super(gstate.round);
    super.message ="yield";
    this.gstate = gstate;
  }

  execute() {
    super.log();
    this.gstate.round++;
    return;
  }

}

export class End extends Move {
  constructor(gstate, reason) {
    super(gstate.round);
    super.message = "end" + " " + reason;
    this.gstate = gstate;
  }

  execute() {
    super.log();
    logger.debug(this.message);
    logger.debug(this.gstate.card);
    return this.next;
  }
}
