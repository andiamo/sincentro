function crearToque(x, y, p, t, primero) {  
  let toque = new Toque(x, y, p, t);
  toque.primero = primero;
  return toque;
}

var Trazo = function(indice = 0, peer = "", capa = null, pincel = null, tinta = null, factorOpacidad = 0, factorEscala = 0, rep = false, t = 0) {
  this.indice = indice;
  this.peer = peer;

  this.capa = capa;
  this.pincel = pincel;
  this.tinta = tinta;
  this.factorOpacidad = factorOpacidad;
  this.factorEscala = factorEscala;

  this.toques = [];

  this.tiempoComienzo = t;
  this.repetir = rep;
  this.cerrado = false;
  this.borrando = false;
  this.borrado = false;

  this.tiempoBorrado = 0;
  this.tiempoFinal = 0;
  this.duracionBorrado = 0;
  this.indicePrevio = 0;

  this.tiempoInterno0 = millis() - this.tiempoComienzo;
}

Trazo.prototype = {
  desempaquetar: function(data) {
    this.indice = data["indice"];
    this.peer = data["peer"];

    this.capa = capas[data["indice_capa"]];
    this.pincel = pinceles[data["indice_pincel"]].nuevoPincel();
    this.tinta = tintasPincel[data["indice_tinta"]];

    let datosToques = data["toques"];
    let n = int(datosToques.length / 6);
    for (let i = 0; i < n; i++) {
      let x = datosToques[6 * i + 0];
      let y = datosToques[6 * i + 1];
      let p = datosToques[6 * i + 2];
      let t = datosToques[6 * i + 3];
      let primero = datosToques[6 * i + 4] === 1;
      let ultimo = datosToques[6 * i + 5] === 1;
      let toque = new Toque(x, y, p, t);
      toque.primero = primero;
      toque.ultimo = ultimo;
      this.toques.push(toque);
    }

    this.factorOpacidad = data["factor_opacidad"];
    this.factorEscala = data["factor_escala"];

    this.tiempoComienzo = data["tiempo_comienzo"];
    this.repetir = data["repetir"];
    this.cerrado = data["cerrado"];
    this.borrando = data["borrando"];
    this.borrado = data["borrado"];
  
    this.tiempoBorrado = data["tiempo_borrado"];
    this.tiempoFinal = data["tiempo_final"];
    this.duracionBorrado = data["duracion_borrado"];
    this.indicePrevio = data["indice_previo"];

    this.tiempoInterno0 = millis() - this.tiempoComienzo;
  },

  empaquetar: function() {
    let data = {};

    data["indice"] = this.indice;
    data["peer"] = this.peer;

    data["indice_capa"] = this.capa.indice;
    data["indice_pincel"] = this.pincel.indice;
    data["indice_tinta"] = this.tinta.indice;

    let datosToques = [];
    for (let toque of this.toques) {
      datosToques.push(toque.x, toque.y, toque.p, toque.t, int(toque.primero), int(toque.ultimo));
    }
    data["toques"] = datosToques;

    data["factor_opacidad"] = this.factorOpacidad;
    data["factor_escala"] = this.factorEscala;

    data["tiempo_comienzo"] = this.tiempoComienzo;
    data["repetir"] = this.repetir;
    data["cerrado"] = this.cerrado;
    data["borrando"] = this.borrando;
    data["borrado"] = this.borrado;
  
    data["tiempo_borrado"] = this.tiempoBorrado;
    data["tiempo_final"] = this.tiempoFinal;
    data["duracion_borrado"] = this.duracionBorrado;
    data["indice_previo"] = this.indicePrevio;

    return data;
  },

  cerrate: function(unico, duracionBorrado) {
    this.cerrado = true;
    this.duracionBorrado = int(duracionBorrado);
    let ultimoToque = this.toques[this.toques.length - 1];
    let fakeToque = new Toque(ultimoToque.x, ultimoToque.y, ultimoToque.p, ultimoToque.t + this.duracionBorrado);
    this.tiempoBorrado = ultimoToque.t;
    this.agregarUnToque(fakeToque);
    ultimoToque.ultimo = true;
    this.borrando = unico;
  },

  dibujate: function(opacidadCapa) {
    if (this.factorOpacidad === 0 || this.factorEscala === 0) return;
    
    let indice = this.toques.length - 1;
    let factorBorrado = 1;
    if (this.cerrado && (this.repetir || this.borrando)) {
      let tiempoInterno = millis() - this.tiempoInterno0;
      let t = int(tiempoInterno - this.tiempoComienzo) % int(this.tiempoFinal - this.tiempoComienzo + 1);
      let indiceCorriente = this.buscarIndice(t);

      if (this.repetir) {
        // Transformar tiempo absoluto (millis) en tiempo relativo al trazo:
        indice = indiceCorriente;
      }
      
      if (this.tiempoBorrado - this.tiempoComienzo <= t) {
        factorBorrado = 1 - float(t - this.tiempoBorrado + this.tiempoComienzo) / this.duracionBorrado;
      }
      
      if (this.borrando && (indiceCorriente < this.indicePrevio || factorBorrado < 0.01)) {
        this.borrado = true;
        this.borrando = false;
        return;
      }
      
      this.indicePrevio = indiceCorriente;
    }

    let opacidad = constrain(opacidadCapa * this.factorOpacidad * factorBorrado * 255, 1, 255);
    this.pincel.pintar(this.toques.slice(0, indice + 1), this.tinta.generarColor(opacidad), this.factorEscala);
  },
  
  borrate: function() {
    this.borrando = true;
  },
  
  agregarUnToque: function(toque) {
    if (this.toques.length === MAX_TOQUES) this.toques.shift();
    this.toques.push(toque);
    this.tiempoFinal = toque.t;
  },
  
  toquePrevioEsUltimo: function() {
    if (0 < this.toques.length) {
      let toque = this.toques[this.toques.length - 1];
      toque.ultimo = true;
    }    
  },
  
  buscarIndice: function(tiempo) {
    let n = this.toques.length;
    let mini = 0;
    let maxi = n;
    let idx = int(mini + (maxi - mini) / 2);
    let iter = 0;
    while (iter < n) {
      let t0 = this.toques[idx].t - this.tiempoComienzo;
      let t1 = 0;
      if (idx < n - 1) {
        t1 = this.toques[idx + 1].t - this.tiempoComienzo;
      } else {
        t1 = tiempo + 1;
      }
      if (t0 <= tiempo && tiempo < t1) {
        return idx;
      } else if (tiempo < t0) {
        maxi = idx;
      } else {
        mini = idx;
      }
      idx = int(mini + (maxi - mini) / 2);
      iter++; 
    }
    return idx;
  } 
}

var Toque = function(x, y, p, t) {
  this.x = x;
  this.y = y;
  this.t = t;
  this.p = p;
  this.primero = false;
  this.ultimo = false;
}