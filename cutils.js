  import { logger } from "./logger.js";
export function chose(dice,card,options) {
  logger.debug(options, "feeling lucky");
  let choice =  Math.floor(Math.random() * options.length);
  choice.selected(dice);    
  return choice;
}


export function note(dice,card,figure) {
  logger.debug(figure, "la cuenta por favor");
  switch (figure.name) {
    case 'chance':
      //build
      if (! card.lower.chance)
        card.lower.chance=figure.valor;
      else
        strike(card,'chance');        
      card.scribe();
      break;
    case 'threesome':   
      //threesome
      if (! card.lower.threesome)
        card.lower.threesome=figure.valor;
      else
        strike(card,'threesome');        
      break;
    case 'foursome':
      //foursome
      if (! card.lower.foursome)
        card.lower.foursome=figure.valor;
      else
        strike('foursome');        
      break;
    case 5:
      //kniffel
      break;
    default:
      logger.error("figure not found!");
  } 
card.out("scriptum");
  return;
}

function strike(card,name){
  const alternate= new Array();
  for (const fig of Object.getOwnPropertyNames(card.lower)) {
    if(fig !== name && !card.lower[fig])
      alternate.push(fig);
  }
  victim(card,alternate);
  return;
}


function victim(card, alternate){
  card.strike( alternate[0]);
}
