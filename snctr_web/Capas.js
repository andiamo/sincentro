var teclasDisminuirTiempoBorrado = ['-', '_'];
var teclasAumentarTiempoBorrado  = ['+', '='];

var teclasDisminuirTiempoTransicionFondo = ['<', ','];
var teclasAumentarTiempoTransicionFondo  = ['>', '.'];

var teclasUnirTrazos = ['~', '`']

function crearCapas() {
  for (let i = 0; i < 9; i++) {
    capas.push(new CapaDibujo(i + 1));
  }
  capaSeleccionada = capas[0];
}

function pintarCapas() {
  for (let i = capas.length - 1; i >= 0; i--) {
    let capa = capas[i];
    capa.pintar();
    if (capa === capaSeleccionada && registrandoTrazo) {
      nuevoTrazo.dibujate();
    }
  }
}

function listaContieneTecla(teclas) {
  for (let tcl of teclas) {
    if (tcl === key) return true;
  }
  return false;
}

var LienzoFondo = function(tinta) {
  this.tintaActual = tinta;
  this.tintaPrevia = null;
  this.tiempoCambio = 0;
  this.cambiando = false;
  this.duracionCambio = 0;
  this.tiempoTransicionSeleccionado = 4;
}

LienzoFondo.prototype = {
  
  pintar: function() {
    let colorFondo;
    if (this.cambiando) {
      let t = millis();
      if (t - this.tiempoCambio < this.duracionCambio) {
        let f = (t - this.tiempoCambio) / this.duracionCambio;      
        colorFondo = this.tintaPrevia.interpolarHacia(this.tintaActual, f);
      } else {
        colorFondo = this.tintaActual.generarColor();
      }      
    } else {
      colorFondo = this.tintaActual.generarColor();  
    }
    background(colorFondo);    
  },
  
  cambiarColor: function(tinta) {
    this.tintaPrevia = this.tintaActual;
    this.tintaActual = tinta;
    this.tiempoCambio = millis();
    this.cambiando = true;
    this.duracionCambio = tiemposTransicionFondo[this.tiempoTransicionSeleccionado];
  },
  
  procesarTeclado: function() {
    if (listaContieneTecla(teclasDisminuirTiempoTransicionFondo)) {
      this.tiempoTransicionSeleccionado = constrain(this.tiempoTransicionSeleccionado - 1, 0, 9);
    } else if (listaContieneTecla(teclasAumentarTiempoTransicionFondo)) {
      this.tiempoTransicionSeleccionado = constrain(this.tiempoTransicionSeleccionado + 1, 0, 9);  
    } else {
      for (let t of tintasFondo) {
        if (listaContieneTecla(t.teclas)) {
          this.cambiarColor(t);
        }
      }
    }
  }
}

var CapaDibujo = function(indice) {
  this.indice = indice;

  this.tiemposBorradoSeleccionado = 2;
  this.nivelOpacidadSeleccionado = 9;
  this.nivelEscalaSeleccionado = 4;

  this.trazos = [];  
  this.factorOpacidad = new NumeroInterpolado(nivelesOpacidadTrazos[this.nivelOpacidadSeleccionado]);
  this.factorEscala = new NumeroInterpolado(nivelesEscalaTrazos[this.nivelEscalaSeleccionado]);
  
  this.pincel = 0;
  this.tinta = 0;

  this.unirTrazos = false;
  this.repetirTrazos = true;
}

CapaDibujo.prototype = {  
  
  pintar: function() {
    this.factorOpacidad.actualizar();
    this.factorEscala.actualizar();
    
    let paraRemover = [];
    for (let i = 0; i < this.trazos.length; i++) {
      let trazo = this.trazos[i];
      trazo.dibujate();
      if (trazo.borrado) paraRemover.push(i);
    }
    for (let i = 0; i < paraRemover.length; i++) {
      let idx = paraRemover[i];
      this.trazos.splice(idx, 1);
    }
  },
  
  borrarTrazos: function() {
    for (let trazo of this.trazos) {
      trazo.borrate();
    }
  },
  
  procesarTeclado: function() {    
    if (keyCode === LEFT_ARROW) {
      this.nivelOpacidadSeleccionado = constrain(this.nivelOpacidadSeleccionado - 1, 0, 9);
      this.factorOpacidad.establecerObjetivo(nivelesOpacidadTrazos[this.nivelOpacidadSeleccionado]);
    } else if (keyCode === RIGHT_ARROW) {
      this.nivelOpacidadSeleccionado = constrain(this.nivelOpacidadSeleccionado + 1, 0, 9);
      this.factorOpacidad.establecerObjetivo(nivelesOpacidadTrazos[this.nivelOpacidadSeleccionado]);
    } else if (keyCode === DOWN_ARROW) {
      this.nivelEscalaSeleccionado = constrain(this.nivelEscalaSeleccionado - 1, 0, 9);
      this.factorEscala.establecerObjetivo(nivelesEscalaTrazos[this.nivelEscalaSeleccionado]);
    } else if (keyCode === UP_ARROW) {
      this.nivelEscalaSeleccionado = constrain(this.nivelEscalaSeleccionado + 1, 0, 9);
      this.factorEscala.establecerObjetivo(nivelesEscalaTrazos[this.nivelEscalaSeleccionado]);
    } else if (keyCode === DELETE || keyCode === BACKSPACE) {
      this.borrarTrazos();
    } else if (key === ' ') {
      this.repetirTrazos = !this.repetirTrazos;
    } else if (listaContieneTecla(teclasUnirTrazos)) {
      this.unirTrazos = !this.unirTrazos;      
    } else if (listaContieneTecla(teclasDisminuirTiempoBorrado)) {
      this.tiemposBorradoSeleccionado = constrain(this.tiemposBorradoSeleccionado - 1, 0, 9);
    } else if (listaContieneTecla(teclasAumentarTiempoBorrado)) {
      this.tiemposBorradoSeleccionado = constrain(this.tiemposBorradoSeleccionado + 1, 0, 9);  
    } else {
      for (let p of pinceles) {
        if (listaContieneTecla(p.teclas)) {
          this.pincel = p.indice;
        }
      }
      for (let t of tintasPincel) {
        if (listaContieneTecla(t.teclas)) {
          this.tinta = t.indice;
        }
      }
    }
  }
}