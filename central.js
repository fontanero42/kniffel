//import { rulezInit } from "./Rulez.js";
import { moveFactory } from "./movee.js";
import { logger } from "./logger.js";
//import fs from  "fs"
//const VERBOSE = true;

const transitions = [
  'start~dice~eqT',
  'dice~score~eqT',
  'score~chose~eqT',
  'chose~dice~eqT', 'chose~note~eqT',
  'note~yield~eqT',
  'yield~dice~eqT', 'yield~end~eqT',
];


function buildGraph(edges) {
  let graph = Object.create(null);

  function addEdge(from, to, cond) {
    let entry;
    if (graph[from] == null) {
      entry = Object.create(null);
      entry.to = to;
      entry.cond = cond;
      graph[from] = [entry];

    } else {
      entry = Object.create(null);
      entry.to = to;
      entry.cond = cond;
      graph[from].push(entry);
    }
  }
  for (let [from, to, cond] of edges.map(r => r.split('~'))) {
    addEdge(from, to, cond);
  }
  return graph;
}

const stateGraph = buildGraph(transitions);


export function createMachine() {
  let machine = Object.create(null);
  machine.init = function (gstate) {
    this.state = 'start'
    this.graph = stateGraph;
    this.fullCard = false
    this.rulezViolation = false;
    this.ruleName = '';
    this.log = new Map();
    this.opt = new Map();
    this.cnt = new Map();
//   gstate.deck.register(machine.deckCb);
    gstate.register(machine.fullCardCb);
//    rulezInit(machine.rulezVl);
    this.move = moveFactory(this.state, this.round);
  }

  machine.execute = function (gstate) {
    logger.debug('exec');
    this.rc = this.move.execute(gstate);
  }

  machine.next = function (gstate) {
    if (this.state == 'end') {
      this.stop();
      return null;
    }
    this.round = this.move.round;
    this.choice = this.move.choice;
    let newStates = this.graph[this.state];
    // select newstate

    for (const item of newStates) {
      if (this.predicate(item.cond)) {
        this.state = item.to;
        return this.move = moveFactory(item.to, this.round, gstate, this.options, this.choice, machine.tableCb, machine.optionsCb, machine.snapshot);
      }
    }
  }
  machine.fullCardCb = function () {
    machine.fullCard = true;
    logger.debug("heureka");
  }
  machine.snapshot = function (round, table) {
    machine.album.generation[round] = [...table];
    logger.debug("snapshot", round);
  }
  machine.rulezVl = function (name) {
    machine.rulezViolation = true;
    machine.ruleName = name;
    logger.debug("rulez Violation", name);
  }

  machine.isF = function () {
    return (this.fullCard);
  }
  machine.rV = function () {
    return (this.rulezViolation);
  }
  machine.eqT = function () {
    return true;
  }
  machine.predicate = function (name) {
    switch (name) {
      case 'eqT':
        return this.eqT();
      case 'isF':
        return this.isE();
      case 'rV':
        return this.rV();
      default:
        logger.debug("predicate not found!");
    }
  }
  machine.stop = function () {
    logger.debug("shutdown");
  }

  return machine;
}


