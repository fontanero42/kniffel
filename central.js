//import { rulezInit } from "./Rulez.js";
import { moveFactory } from "./movee.js";
import { logger } from "./logger.js";
import { createDice, createScorecard } from "./dice.js";
//import fs from  "fs"
//const VERBOSE = true;
const transitions = [
  'start~dice~eqT',
  'dice~score~eqT',
  'score~chose~eqT',
  'chose~note~x3T','chose~dice~eqT', 
  'note~yield~eqT',
  'yield~end~isF','yield~dice~eqT' 
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
  let fullCard;
  function init (gstate) {
    gstate.round=0;
    this.gstate=gstate;
    this.state = 'start'
    this.graph = stateGraph;
    gstate.dice = createDice();
    gstate.card = createScorecard();
    gstate.options = new Array();
    gstate.choice = null;
    this.fullCard = false;
    this.lastTry = false;
    this.rulezViolation = false;
    this.ruleName = '';
//    this.log = logger.child({ test: 'machine'});
    gstate.card.register(fullCardCb.bind(this));
    gstate.dice.register(xtrTryCb.bind(this));
    //    rulezInit(machine.rulezVl);
    this.move = moveFactory(this.state, this.gstate);
  }
  machine.getContext = function (){
    return {state:this.state  };
  }
  function execute (gstate) {
    logger.debug('exec');
    this.rc = this.move.execute(gstate,this.dice);
  }

  const next = function (gstate) {
    if (this.state == 'end') {
      stop();
      return null;
    }
    //this.round = this.move.round;
    this.choice = this.move.choice;
    let newStates = this.graph[this.state];
    // select newstate

    for (const item of newStates) {
      if (predicate.call(this,item.cond)) {
        this.state = item.to;
        return this.move = moveFactory(item.to, gstate);
      }
    }
  }
  function fullCardCb () {
    this.fullCard = true;
    logger.debug("heureka");
  }
  function xtrTryCb () {
    this.lastTry= ! this.lastTry;
    logger.debug("enough is enough");
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
  function x3T() {
    return (this.lastTry);
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
        return isF.call(this);
      case 'x3T':
        return x3T.call(this);
      case 'rV':
        return rV();
      default:
        logger.debug("predicate not found!");
    }
  }
  const stop = function () {
    logger.debug("shutdown");
  }

  return {machine, init, execute, next, fullCardCb,fullCard};
}


