  import { logger } from "./logger.js";
console.log(logger);
/*logger.formatters ={
    log (obj) {
      obj.foo='bar';
      delete  obj.log;
      return (obj)
    }
  };*/

export function createExperiment() {
    let experiment = Object.create(null);
    let color= "green";
    let rainbow="gray";
    function init (color, valor) {
      this.color = color;
        this.valor = valor;
        this.log = logger.child({ test: 'test', color: this.color, valor: this.valor });
        test.call(this);
    }
    function out () {
        this.log.debug("go int");
    }
    function test () {
      this.rainbow="color"
      console.log("inner");
    }
     return {experiment, init, out, rainbow};
}

const employee= {
  name: "john",
  age:51,
  email: "john@example.com",
  password:"abc"
};

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
logger.debug(employee,"see what happens");