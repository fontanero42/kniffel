import { createMachine } from "./central.js";
import { logger } from "./logger.js";

class GameState {
    constructor() {
    }

    play(machine) {
        let nx;
        logger.info('Hello, info world!');
        logger.debug('Hello, debug world!');
        logger.trace('Hello, trace world!');

        do {
            machine.execute(this);
            //this.dumpState();
            nx = machine.next(this);
        } while (nx != null);
        return machine.stats;
    }

    register(cb) {
        this.callback = cb;
    }

}
let machine = createMachine();
const g = new GameState();

machine.init(g);

g.play(machine);


                