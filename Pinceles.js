// Nuevos pinceles se pueden probar en el editor online de p5.js usando este bosquejo de ejemplo:
// https://editor.p5js.org/codeanticode/sketches/EEURt9RtI

function cargarPinceles(p) {
  pinceles = [];
  pinceles.push(new PincelAndiamo1(p, 0, "AND", ['Q', 'q']));
  pinceles.push(new PincelLinea(p, 1, "LIN", ['W', 'w']));
  pinceles.push(new PincelCinta(p, 2, "CIN", ['E', 'e']));
  pinceles.push(new PincelBola(p, 3, "BOL", ['R', 'r']));
  pinceles.push(new PincelAnimado(p, 4, "ANI", ['T', 't']));
}

function distintos(ptoque, toque) {
  if (ptoque === null) return false;
  return ptoque.x !== toque.x || ptoque.y !== toque.y;
}

function obtenerListaTeclasPinceles() {
  let teclas = [];
  for (let pincel of pinceles) {
    teclas.push(pincel.teclas);
  }
  return teclas;
}

var PincelLinea = function(p, indice, nombre, teclas) { 
  this.p = p;
  this.indice = indice;
  this.nombre = nombre;
  this.teclas = teclas;
}

PincelLinea.prototype = {  
  nuevoPincel: function() {
    return new PincelLinea(this.p, this.indice, this.nombre, this.teclas);
  },
  
  pintar: function(toques, tinta, escala) {
    let p = this.p;
    p.stroke(tinta);
    p.strokeWeight(escala);
    let ptoque = null;
    for (let toque of toques) {
      if (distintos(ptoque, toque) && !toque.primero) {        
        p.line(ptoque.x, ptoque.y, toque.x, toque.y);      
      }
      ptoque = toque;
    }
  }
}

var PincelCinta = function(p, indice, nombre, teclas) {
  this.p = p;
  this.indice = indice;
  this.nombre = nombre;
  this.teclas = teclas;
}
  
PincelCinta.prototype = {  
  nuevoPincel: function() {
    return new PincelCinta(this.p, this.indice, this.nombre, this.teclas);
  },
  
  pintar: function(toques, tinta, escala) {
    let p = this.p;
    p.noStroke();
    p.fill(tinta);
    let w = 0;
    let ptoque = null;
    for (let toque of toques) {
      if (toque.primero) {
        if (ptoque !== null) p.endShape();        
        p.beginShape(p.QUAD_STRIP);
        w = 0;
      } else if (distintos(ptoque, toque)) { 
        let dx = toque.x - ptoque.x;
        let dy = toque.y - ptoque.y;
        let d2 = p.sqrt(p.sq(dx) + p.sq(dy));
        let nx = 0;
        let ny = 0;        
        if (!toque.ultimo) {
          nx = dy / d2;
          ny = -dx / d2;          
        }
        w = 0.9 * w + 0.1 * toque.p;
        p.vertex(toque.x + nx * w * escala, toque.y + ny * w * escala);
        p.vertex(toque.x - nx * w * escala, toque.y - ny * w * escala);
      }      
      ptoque = toque;
    }
    p.endShape();
  }
}

var PincelBola = function(p, indice, nombre, teclas) { 
  this.p = p;
  this.indice = indice;
  this.nombre = nombre;
  this.teclas = teclas;
}
  
PincelBola.prototype = {  
  nuevoPincel: function() {
    return new PincelBola(this.p, this.indice, this.nombre, this.teclas);
  },
  
  pintar: function(toques, tinta, escala) {
    let p = this.p;
    if (1 < toques.length) {
      p.strokeCap(p.ROUND);
      let toque = toques[toques.length - 1];
      let ptoque = toques[toques.length - 2];
      let r = 2 * toque.p * escala;
      p.stroke(tinta);
      p.noFill();      
      p.strokeWeight(r);
      p.line(ptoque.x, ptoque.y, toque.x, toque.y);
    } else if (toques.length === 1) {
      p.noStroke();
      p.fill(tinta);      
      let toque = toques[toques.length - 1];
      let r = 5 * escala;
      p.ellipse(toque.x, toque.y, r, r);
   }
  }
}

var PincelAnimado = function(p, indice, nombre, teclas) { 
  this.p = p;
  this.indice = indice;
  this.nombre = nombre;
  this.teclas = teclas;
  this.offset = p.random(10);
}
  
PincelAnimado.prototype = {  
  nuevoPincel: function() {
    return new PincelAnimado(this.p, this.indice, this.nombre, this.teclas);
  },
  
  pintar: function(toques, tinta, escala) {
    let p = this.p;
    if (0 < toques.length) {
      p.noStroke();
      p.fill(tinta);      
      let toque = toques[toques.length - 1];
      let r = 20 * escala * p.noise(this.offset + p.millis() / 2500.0);
      p.ellipse(toque.x, toque.y, r, r);      
    }
  }
}