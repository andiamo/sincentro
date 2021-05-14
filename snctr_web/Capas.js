function crearCapas() {
  for (let i = 0; i < MAX_CAPAS; i++) {
    capas.push(new CapaDibujo(i));
  }
}

function pintarCapas() {
  for (let i = capas.length - 1; i >= 0; i--) {
    let capa = capas[i];
    capa.pintar();
    capa.pintarNuevoTrazo(estado);
    for (let otro of otrosEstados.values()) capa.pintarNuevoTrazo(otro);
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

  pintarNuevoTrazo: function(estado) {
    if (this.indice === estado.capaSeleccionada && estado.registrandoTrazo) {
      estado.nuevoTrazo.dibujate(this.opacidad.valor);
    }
  },
  
  mostrar: function() {
    this.opacidad.establecerObjetivo(1);
  },

  ocultar: function() {
    this.opacidad.establecerObjetivo(0);
  },

  borrarTrazos: function(peer) {
    for (let trazo of this.trazos) {
      if (trazo.peer == peer) trazo.borrate();
    }
  }
}