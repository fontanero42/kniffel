import { createMachine } from "./central.js";
import { logger } from "./logger.js";

class GameState {
    constructor() {
    }

    play(machine) {
        let nx;
        logger.info('Hello, world!');
        logger.debug('Hello, world!');
        logger.trace('Hello, world!');

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
const g = new GameState();
let machine = createMachine();

machine.init(g);
g.play(machine);


