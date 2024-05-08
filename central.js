//import { rulezInit } from "./Rulez.js";
import { moveFactory } from "./movee.js";
import { logger } from "./logger.js";
import { createDice } from "./dice.js";
//import fs from  "fs"
//const VERBOSE = true;
const transitions = [
  'start~dice~eqT',
  'dice~score~eqT',
  'score~chose~eqT',
  'chose~dice~eqF', 'chose~note~eqT',
  'note~yield~eqT',
  'yield~dice~eqF', 'yield~end~eqT',
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
  function init (gstate) {
    this.gstate=gstate;
    this.state = 'start'
    this.graph = stateGraph;
    this.dice = createDice();
    this.fullCard = false;
    this.rulezViolation = false;
    this.ruleName = '';
    this.log = logger.child({ test: 'machine'});
    //   gstate.deck.register(machine.deckCb);
    gstate.register(machine.fullCardCb);
    //    rulezInit(machine.rulezVl);
    this.move = moveFactory(this.state, this.round);
  }
  machine.getContext = function (){
    return {state:this.state  };
  }
  function execute (gstate) {
    this.log.debug('exec');
    this.rc = this.move.execute(gstate,this.dice);
  }

  const next = function (gstate) {
    if (this.state == 'end') {
      stop();
      return null;
    }
    this.round = this.move.round;
    this.choice = this.move.choice;
    let newStates = this.graph[this.state];
    // select newstate

    for (const item of newStates) {
      if (predicate(item.cond)) {
        this.state = item.to;
        return this.move = moveFactory(item.to, this.round, gstate, this.dice);
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

  function isF() {
    return (this.fullCard);
  }
  function rV() {
    return (this.rulezViolation);
  }
  function eqT() {
    return true;
  }
  function eqF() {
    return false;
  }

  const predicate = function (name) {
    switch (name) {
      case 'eqT':
        return eqT();
      case 'eqF':
        return eqF();
      case 'isF':
        return isF();
      case 'rV':
        return rV();
      default:
        logger.debug("predicate not found!");
    }
  }
  const stop = function () {
    logger.debug("shutdown");
  }

  return {machine, init, execute, next};
}


