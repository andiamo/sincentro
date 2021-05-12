// Nuevos pinceles se pueden probar en el editor online de p5.js usando este bosquejo de ejemplo:
// https://editor.p5js.org/codeanticode/sketches/EEURt9RtI

function cargarPinceles() {
  pinceles = [];
  pinceles.push(new PincelLinea(0, "LIN", ['Q', 'q']));
  pinceles.push(new PincelCinta(1, "CIN", ['W', 'w']));
  pinceles.push(new PincelBola(2, "BOL", ['E', 'e']));
  pinceles.push(new PincelAnimado(3, "ANI", ['R', 'r']));
}

function distintos(ptoque, toque) {
  if (ptoque === null) return false;
  return ptoque.x !== toque.x || ptoque.y !== toque.y;
}

var PincelLinea = function(indice, nombre, teclas) { 
  this.indice = indice;
  this.nombre = nombre;
  this.teclas = teclas;
}
  
PincelLinea.prototype = {  
  nuevoPincel: function() {
    return new PincelLinea(this.indice, this.nombre, this.teclas);
  },
  
  pintar: function(toques, tinta, escala) {
    stroke(tinta);
    strokeWeight(escala);
    let ptoque = null;
    for (let toque of toques) {
      if (distintos(ptoque, toque) && !toque.primero) {        
        line(ptoque.x, ptoque.y, toque.x, toque.y);      
      }
      ptoque = toque;
    }
  }
}

var PincelCinta = function(indice, nombre, teclas) { 
  this.indice = indice;
  this.nombre = nombre;
  this.teclas = teclas;
}
  
PincelCinta.prototype = {  
  nuevoPincel: function() {
    return new PincelCinta(this.indice, this.nombre, this.teclas);
  },
  
  pintar: function(toques, tinta, escala) {
    noStroke();
    fill(tinta);
    let w = 0;
    let ptoque = null;
    for (let i = 0; i < toques.length; i++) {
      let toque = toques[i];
      if (toque.primero) {
        if (ptoque !== null) endShape();        
        beginShape(QUAD_STRIP);
        w = 0;
      } else if (distintos(ptoque, toque)) { 
        let dx = toque.x - ptoque.x;
        let dy = toque.y - ptoque.y;
        let d2 = sqrt(sq(dx) + sq(dy));
        let nx = 0;
        let ny = 0;        
        if (!toque.ultimo) {
          nx = dy / d2;
          ny = -dx / d2;          
        }
        w = 0.9 * w + 0.1 * toque.p;
        vertex(toque.x + nx * w * escala, toque.y + ny * w * escala);
        vertex(toque.x - nx * w * escala, toque.y - ny * w * escala);
      }      
      ptoque = toque;
    }
    endShape();
  }
}

var PincelBola = function(indice, nombre, teclas) { 
  this.indice = indice;
  this.nombre = nombre;
  this.teclas = teclas;
}
  
PincelBola.prototype = {  
  nuevoPincel: function() {
    return new PincelBola(this.indice, this.nombre, this.teclas);
  },
  
  pintar: function(toques, tinta, escala) {
    if (1 < toques.length) {
      strokeCap(ROUND);
      let toque = toques[toques.length - 1];
      let ptoque = toques[toques.length - 2];
      let r = 2 * toque.p * escala;
      stroke(tinta);
      noFill();      
      strokeWeight(r);
      line(ptoque.x, ptoque.y, toque.x, toque.y);
    } else if (toques.length === 1) {
      noStroke();
      fill(tinta);      
      let toque = toques[toques.length - 1];
      let r = 5 * escala;
      ellipse(toque.x, toque.y, r, r);
   }
  }
}

var PincelAnimado = function(indice, nombre, teclas) { 
  this.indice = indice;
  this.nombre = nombre;
  this.teclas = teclas;
  this.offset = random(10);
}
  
PincelAnimado.prototype = {  
  nuevoPincel: function() {
    return new PincelAnimado(this.indice, this.nombre, this.teclas);
  },
  
  pintar: function(toques, tinta, escala) {
    if (0 < toques.length) {
      noStroke();
      fill(tinta);      
      let toque = toques[toques.length - 1];
      let r = 20 * escala * noise(this.offset + millis() / 2500.0);
      ellipse(toque.x, toque.y, r, r);      
    }
  }
}