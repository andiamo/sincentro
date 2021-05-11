// Nuevos pinceles se pueden probar en el editor online de p5.js usando este bosquejo de ejemplo:
// https://editor.p5js.org/codeanticode/sketches/EEURt9RtI

function cargarPinceles() {
  pinceles = [];
  pinceles.push(new PincelLinea(0, "LIN", ['Q', 'q']));
}

var PincelLinea = function(nombre, teclas, indice) { 
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
      if (toque == null) return;
      if (toque.distinto(ptoque) && !toque.primero) {        
        line(ptoque.x, ptoque.y, toque.x, toque.y);      
      }
      ptoque = toque;
    }      
  }
}
