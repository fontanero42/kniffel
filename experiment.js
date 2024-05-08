import { logger } from "./logger.js";
//console.log(logger);
/*logger.formatters ={
    log (obj) {
      obj.foo='bar';
      delete  obj.log;
      return (obj)
    }
  };*/

export function createExperiment() {
    let experiment = Object.create(null);
    let color = "green";
    let valor = 0;
    const init = function (color, valor) {
        this.color = color;
        this.valor = valor;
        this.log = logger.child({ test: 'test', color: this.color, valor: this.valor });
    }
      const out = function () {
        this.log.debug("go int");
    }
    const proxy= {farbe: color, wert: valor};
    return {experiment, valor, color, init,out,proxy}
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
logger.debug(ex,'try');
logger.debug(ex.proxy,'stellvertreter');
