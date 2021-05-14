function crearCapas() {
  for (let i = 0; i < 9; i++) {
    capas.push(new CapaDibujo(i + 1));
  }
}

function pintarCapas() {
  for (let i = capas.length - 1; i >= 0; i--) {
    let capa = capas[i];
    capa.pintar();
    if (i === estado.capaSeleccionada && estado.registrandoTrazo) {
      estado.nuevoTrazo.dibujate(capa.opacidad.valor);
    }
  }
}

var LienzoFondo = function() {
  this.tintaActual = tintasFondo[0];
  this.tintaPrevia = null;
  this.tiempoCambio = 0;
  this.cambiando = false;
  this.duracionCambio = 0;
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
    this.duracionCambio = tiemposTransicionFondo[estado.tiempoTransicionFondoSeleccionado];
  }
}

var CapaDibujo = function(indice) {
  this.indice = indice;
  this.trazos = [];  
  this.opacidad = new NumeroInterpolado(1);
}

CapaDibujo.prototype = {  
  pintar: function() {
    this.opacidad.actualizar();
    let paraRemover = [];
    for (let i = 0; i < this.trazos.length; i++) {
      let trazo = this.trazos[i];
      trazo.dibujate(this.opacidad.valor);
      if (trazo.borrado) paraRemover.push(i);
    }
    for (let idx of paraRemover) this.trazos.splice(idx, 1);
  },
  
  mostrar: function() {
    this.opacidad.establecerObjetivo(1);
  },

  ocultar: function() {
    this.opacidad.establecerObjetivo(0);
  },

  borrarTrazos: function() {
    for (let trazo of this.trazos) {
      trazo.borrate();
    }
  }
}