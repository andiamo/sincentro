function obtenerListaTeclasTintasFondo() {
  let teclas = [];
  for (let tinta of tintasFondo) {
    teclas.push(tinta.teclas);
  }
  return teclas;
}

function obtenerListaTeclasTintasPincel() {
  let teclas = [];
  for (let tinta of tintasPincel) {
    teclas.push(tinta.teclas);
  }
  return teclas;
}

function cargarColores(p) {  
  tintasFondo.push(new Tinta(p, 0, "BL", ['Z', 'z'], '#FFFFFF'));
  tintasFondo.push(new Tinta(p, 1, "NG", ['X', 'x'], '#000000'));
  tintasFondo.push(new Tinta(p, 2, "PR", ['C', 'c'], '#B136FF'));
  tintasFondo.push(new Tinta(p, 3, "NJ", ['V', 'v'], '#FFB236'));
    
  tintasPincel.push(new Tinta(p, 0, "NG", ['A', 'a'], '#171717'));
  tintasPincel.push(new Tinta(p, 1, "BL", ['S', 's'], '#F7F7F7'));
  tintasPincel.push(new Tinta(p, 2, "RJ", ['D', 'd'], '#EA8879'));
  tintasPincel.push(new Tinta(p, 3, "VR", ['F', 'f'], '#A6EA6B'));
  tintasPincel.push(new Tinta(p, 4, "AZ", ['G', 'g'], '#2E86F0'));
  tintasPincel.push(new Tinta(p, 5, "PR", ['H', 'h'], '#B136FF'));  
}

var Tinta = function(p, indice, name, teclas, c) {
  this.p = p;
  this.indice = indice;
  this.nombre = name;
  this.teclas = teclas;
  
  this.rojo = p.red(c);
  this.verde = p.green(c);
  this.azul = p.blue(c);
}

Tinta.prototype = {
  generarColor: function(opacidad = 255) {
    return this.p.color(this.rojo, this.verde, this.azul, opacidad);
  }, 

  generarColorComplementario: function(opacidad=255) {
    return this.p.color(255 - this.rojo, 255 - this.verde, 255 - this.azul, opacidad);
  },
  
  interpolarHacia: function(destino, factor) {
    return this.p.lerpColor(this.generarColor(), destino.generarColor(), factor);
  }
}