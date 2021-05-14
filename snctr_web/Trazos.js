function crearToque(x, y, p, t, primero) {  
  let toque = new Toque(x, y, p, t);
  toque.primero = primero;
  return toque;
}

var Trazo = function(indice, peer, capa, pincel, tinta, factorOpacidad, factorEscala, rep, t) {
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
}

Trazo.prototype = {
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
      let t = int(millis() - this.tiempoComienzo) % int(this.tiempoFinal - this.tiempoComienzo + 1);
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
    if (0 < toques.length) {
      let toque = toques[toques.length - 1];
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