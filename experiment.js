import { logger } from "./logger.js";

export function createExperiment() {
    let experiment = Object.create(null);
    experiment.color = "green";
    experiment.init = function (color, valor) {
        this.color = color;
        this.valor = valor;
        this.log = logger.child({ test: 'test', color: this.color, valor: this.valor });
    }
    experiment.out = function () {
        this.log.debug("go int");
    }
    return experiment;
}

let ex = createExperiment();
console.log(ex.color);
ex.init('blue', 8);
console.log(ex.color);
ex.out();
console.log(ex.valor);
let ex2 = createExperiment();
ex2.init('red', 0);
ex2.out();
ex.valor = 10;
console.log(ex.valor);
