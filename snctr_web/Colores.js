function cargarColores() {  
  tintasFondo.push(new Tinta(0, "BL", ['Z', 'z'], '#FFFFFF'));
  tintasFondo.push(new Tinta(1, "NG", ['X', 'x'], '#000000'));
    
  tintasPincel.push(new Tinta(0, "NG", ['A', 'a'], '#171717'));
  tintasPincel.push(new Tinta(1, "BL", ['S', 's'], '#F7F7F7'));
  tintasPincel.push(new Tinta(2, "RJ", ['D', 'd'], '#EA8879'));
  tintasPincel.push(new Tinta(3, "VR", ['F', 'f'], '#A6EA6B'));
  tintasPincel.push(new Tinta(4, "AZ", ['G', 'g'], '#4EC7EA'));
}

var Tinta = function(indice, name, teclas, c) {
  this.indice = indice;
  this.nombre = name;
  this.teclas = teclas;
  
  this.rojo = red(c);
  this.verde = green(c);
  this.azul = blue(c);
}

Tinta.prototype = {
  generarColor: function(opacidad = 255) {
    return color(this.rojo, this.verde, this.azul, opacidad);
  }, 

  generarColorComplementario: function(opacidad=255) {
    return color(255 - this.rojo, 255 - this.verde, 255 - this.azul, opacidad);
  },
  
  interpolarHacia: function(destino, factor) {
    return lerpColor(this.generarColor(), destino.generarColor(), factor);
  }
}