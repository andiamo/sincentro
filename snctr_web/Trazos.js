function crearToque(primero) {
  let p = sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY));
  let toque = new Toque(mouseX, mouseY, millis(), p);
  toque.primero = primero;
  return toque;
}

function cerrarTrazo(capa, unico) {  
  if (capa.trazos.length == MAX_TRAZOS) capa.trazos.shift(); 
  nuevoTrazo.cerrate(unico);
  capa.trazos.push(nuevoTrazo);
  registrandoTrazo = false;
}

var Trazo = function(capa, pincel, tinta, rep, t) {        
  this.capa = capa;
  this.pincel = pincel;
  this.tinta = tinta;

  this.toques = [];
  this.tiempoComienzo = t;
  this.tiempoBorrado = 0;
  this.tiempoFinal = 0;

  this.duracionBorrado = 0;
  this.indicePrevio = 0;

  this.repetir = rep;
  this.cerrado = false;
  this.borrando = false;
  this.borrado = false; 
}

Trazo.prototype = {

  cerrate: function(unico) {
    this.cerrado = true;
    this.duracionBorrado = tiemposBorradoTrazo[this.capa.tiemposBorradoSeleccionado];
    let ultimoToque = this.toques[this.toques.length - 1];
    let fakeToque = new Toque(ultimoToque.x, ultimoToque.y, 0, ultimoToque.t + this.duracionBorrado);
    this.tiempoBorrado = ultimoToque.t;
    this.agregarUnToque(fakeToque);
    ultimoToque.ultimo = true;
    this.borrando = unico;
  },

  dibujate: function() {
    if (this.capa.factorOpacidad.valor === 0) return;
    
    let indice = this.toques.length - 1;
    let factorBorrado = 1;
    if (this.cerrado && (this.repetir || this.borrando)) {
      
      let t = (millis() - this.tiempoComienzo) % (this.tiempoFinal - this.tiempoComienzo + 1);
      let indiceCorriente = this.buscarIndice(t);
      // print(this.toques.length, t, indiceCorriente);

      if (this.repetir) {
        // Transformar tiempo absoluto (millis) en tiempo relativo al trazo:        
        indice = indiceCorriente;
      }
      
      if (this.tiempoBorrado - this.tiempoComienzo <= t) {
        this.factorBorrado = 1 - (t - this.tiempoBorrado + this.tiempoComienzo) / this.duracionBorrado;
      }
      
      if (this.borrando && (indiceCorriente < this.indicePrevio || factorBorrado < 0.01)) {
        this.borrado = true;
        this.borrando = false;
        return;
      }
      
      this.indicePrevio = indiceCorriente;      
    }

    let opacidad = constrain(this.capa.factorOpacidad.valor * factorBorrado * 255, 1, 255);    
    this.pincel.pintar(this.toques.slice(0, indice + 1), this.tinta.generarColor(opacidad), this.capa.factorEscala.valor);
  },
  
  borrate: function() {
    this.borrando = true;
  },
  
  agregarUnToque: function(toque) {
    if (this.toques.length == MAX_TOQUES) this.toques.shift();
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

  // buscarIndice: function(tiempo) {
  //   if (0 < this.toques.length) {
  //     let n = this.toques.length - 1;
  //     let t = tiempo
  //     let i = 0;
  //     for (i = 0; i < n - 1; i++) {
  //       // print(i, this.toques[i].t - this.tiempoComienzo, this.toques[i + 1].t - this.tiempoComienzo)
  //       if (this.toques[i].t - this.tiempoComienzo <= t && t < this.toques[i + 1].t - this.tiempoComienzo) {          
  //         break;
  //       }
  //     }
      
  //     return i;
  //   } else {
  //     return this.toques.length - 1;
  //   }    
  // }
}

var Toque = function(x, y, t, p) {
  this.x = x;
  this.y = y;    
  this.t = t;
  this.p = p;
  this.primero = false;
  this.ultimo = false;  
}

Toque.prototype = {
  distinto: function(otro) {
    if (otro == null) return false;    
    return otro.x != this.x || otro.y != this.y;
  }
}