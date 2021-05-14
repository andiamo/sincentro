var teclasDisminuirTiempoBorrado = ['-', '_'];
var teclasAumentarTiempoBorrado  = ['+', '='];

var teclasDisminuirTiempoTransicionFondo = ['<', ','];
var teclasAumentarTiempoTransicionFondo  = ['>', '.'];

var teclasUnirTrazos = ['~', '`']

var teclasSeleccionUnaCapa = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
var teclasSeleccionTodasLasCapas = ['0'];

var teclasOcultarUnaCapa = ['!', '@', '#', '$', '%', '^', '&', '*', '('];
var teclasOcultarTodasLasCapas = [')'];

var teclasMostrarID = [';', ':'];
var teclasPedirID  = ['/', '?'];

function listaContieneTecla(tecla, teclas) {
  for (let tcl of teclas) {
    if (tcl === tecla) return true;
  }
  return false;
}

function indiceDeTecla(tecla, teclas) {
  for (let i = 0; i < teclas.length; i++) {
    let tcl = teclas[i];
    if (tcl === tecla) return i;
  }
  return -1;
}

function modificador() {
  let mod = -1;
  if (isKeyPressed) {
    if (keyCode === SHIFT) {
      mod = SHIFT;
    }
  }
  return mod;
}

var Estado = function(peerID) {
  this.peerID = peerID;

  this.nuevoTrazo = null;
  this.indiceTrazo = 0;

  this.capaSeleccionada = 0;
  this.pincelSeleccionado = 0;
  this.tintaPincelSeleccionada = 0;  
  this.tintaFondoSeleccionada = 0;
  this.todasCapasSeleccionadas = false;
  this.registrandoTrazo = false;
  this.mostrarTextoDeEstado = true;
  this.unirTrazos = false;
  this.repetirTrazos = true;
  
  this.tiempoBorradoSeleccionado = 2;
  this.nivelOpacidadSeleccionado = 9;
  this.nivelEscalaSeleccionado = 4;
  this.tiempoTransicionFondoSeleccionado = 4;

  this.tiempoBorradoTrazos = new NumeroInterpolado(tiemposBorradoTrazo[this.tiempoBorradoSeleccionado]);
  this.factorOpacidadTrazos = new NumeroInterpolado(nivelesOpacidadTrazos[this.nivelOpacidadSeleccionado]);
  this.factorEscalaTrazos = new NumeroInterpolado(nivelesEscalaTrazos[this.nivelEscalaSeleccionado]);

  textFont("Helvetica", 18);
}

Estado.prototype = {
  actualizar: function() {
    this.tiempoBorradoTrazos.actualizar();
    this.factorOpacidadTrazos.actualizar();
    this.factorEscalaTrazos.actualizar();  
  },

  iniciarTrazo: function(i, x, y, p, t, enviar = false) {
    if (!this.registrandoTrazo) {
      this.registrandoTrazo = true;
      this.indiceTrazo = i;
      this.nuevoTrazo = new Trazo(this.indiceTrazo, this.peerID,
                                  capas[this.capaSeleccionada], 
                                  pinceles[this.pincelSeleccionado].nuevoPincel(), 
                                  tintasPincel[this.tintaPincelSeleccionada], 
                                  this.factorOpacidadTrazos.valor,
                                  this.factorEscalaTrazos.valor,
                                  this.repetirTrazos, t);                                    
    }    
    this.nuevoTrazo.agregarUnToque(crearToque(x, y, p, t, true));

    if (enviar && 0 < otrosIDs.size()) {
      enviarIniciarTrazo(i, x, y, p, t);
    }
  },

  actualizarTrazo: function(i, x, y, p, t, enviar = false) {
    if (this.registrandoTrazo) {
      if (i === this.nuevoTrazo.indice) {
        this.nuevoTrazo.agregarUnToque(crearToque(x, y, p, t, false));
      } else {
       this.terminarTrazo(i, false);
      }
    }
    if (enviar && 0 < otrosIDs.size()) {
      enviarActualizarTrazo(i, x, y, p, t);
    }
  },

  terminarTrazo: function(i, unico, enviar = false) {
    if (this.registrandoTrazo) {
      if (this.unirTrazos) {
        this.nuevoTrazo.toquePrevioEsUltimo();
      } else {
        let capa = capas[this.capaSeleccionada];
        if (capa.trazos.length === MAX_TRAZOS) capa.trazos.shift(); 
        this.nuevoTrazo.cerrate(unico, this.tiempoBorradoTrazos.valor);
        capa.trazos.push(this.nuevoTrazo);
        this.registrandoTrazo = false;
      }
    }
    if (enviar && 0 < otrosIDs.size()) {
      enviarTerminarTrazo(i, unico);
    }   
  },

  mostrar: function() {
    if (this.mostrarTextoDeEstado && !mostrandoID) {
      let texto = "";
      texto = "C" + (this.capaSeleccionada + 1);
      if (capas[this.capaSeleccionada].opacidad.valor == 0) texto += "?";       
      if (this.todasCapasSeleccionadas) texto += "!";
      texto += ":" + pinceles[this.pincelSeleccionado].nombre;
      texto += ":f" + tintasFondo[this.tintaFondoSeleccionada].nombre;
      texto += ":f" + this.tiempoTransicionFondoSeleccionado;
      texto += ":p" + tintasPincel[this.tintaPincelSeleccionada].nombre;
      texto += ":B" + this.tiempoBorradoSeleccionado;  
      texto += ":R" + int(this.repetirTrazos);
      texto += ":U" + int(this.unirTrazos);
      texto += ":O" + this.nivelOpacidadSeleccionado;
      texto += ":E" + this.nivelEscalaSeleccionado;
      noStroke();
      fill(lienzo.tintaActual.generarColorComplementario());  
      text(texto, 0, 0, width, 20);      
    }    
  },

  procesarTeclado: function(keyCode, key, enviar = false) {
    if (keyCode === LEFT_ARROW) {
      this.nivelOpacidadSeleccionado = constrain(this.nivelOpacidadSeleccionado - 1, 0, 9);
      this.factorOpacidadTrazos.establecerObjetivo(nivelesOpacidadTrazos[this.nivelOpacidadSeleccionado]);
    } else if (keyCode === RIGHT_ARROW) {
      this.nivelOpacidadSeleccionado = constrain(this.nivelOpacidadSeleccionado + 1, 0, 9);
      this.factorOpacidadTrazos.establecerObjetivo(nivelesOpacidadTrazos[this.nivelOpacidadSeleccionado]);
    } else if (keyCode === DOWN_ARROW) {
      this.nivelEscalaSeleccionado = constrain(this.nivelEscalaSeleccionado - 1, 0, 9);
      this.factorEscalaTrazos.establecerObjetivo(nivelesEscalaTrazos[this.nivelEscalaSeleccionado]);
    } else if (keyCode === UP_ARROW) {
      this.nivelEscalaSeleccionado = constrain(this.nivelEscalaSeleccionado + 1, 0, 9);
      this.factorEscalaTrazos.establecerObjetivo(nivelesEscalaTrazos[this.nivelEscalaSeleccionado]);
    } else if (keyCode === DELETE || keyCode === BACKSPACE) {
      if (this.todasCapasSeleccionadas) {
        for (let capa of capas) capa.borrarTrazos(this.peerID);
      } else {
        capas[this.capaSeleccionada].borrarTrazos(this.peerID);
      }
    } else if (keyCode === ENTER || keyCode === RETURN) {
      this.mostrarTextoDeEstado = !this.mostrarTextoDeEstado;
    } else if (key === ' ') {
      this.repetirTrazos = !this.repetirTrazos;
    } else if (listaContieneTecla(key, teclasUnirTrazos)) {
      this.unirTrazos = !this.unirTrazos;
    } else if (listaContieneTecla(key, teclasSeleccionUnaCapa)) {
      this.capaSeleccionada = indiceDeTecla(key, teclasSeleccionUnaCapa);
      if (enviar) {
        capas[this.capaSeleccionada].mostrar(); 
      }
      this.todasCapasSeleccionadas = false;
    } else if (listaContieneTecla(key, teclasSeleccionTodasLasCapas)) {
      if (enviar) {
        for (let capa of capas) capa.mostrar();
      }
      this.todasCapasSeleccionadas = true;
    } else if (listaContieneTecla(key, teclasOcultarUnaCapa)) {
      let i = indiceDeTecla(key, teclasOcultarUnaCapa);
      if (enviar) {
        capas[i].ocultar();
      }
    } 
    else if (listaContieneTecla(key, teclasOcultarTodasLasCapas)) {
      if (enviar) {
        for (let capa of capas) capa.ocultar();
      }
    } else if (listaContieneTecla(key, teclasDisminuirTiempoTransicionFondo)) {
      this.tiempoTransicionFondoSeleccionado = constrain(this.tiempoTransicionFondoSeleccionado - 1, 0, 9);
    } else if (listaContieneTecla(key, teclasAumentarTiempoTransicionFondo)) {
      this.tiempoTransicionFondoSeleccionado = constrain(this.tiempoTransicionFondoSeleccionado + 1, 0, 9);  
    } else if (listaContieneTecla(key, teclasDisminuirTiempoBorrado)) {       
      this.tiempoBorradoSeleccionado = constrain(this.tiempoBorradoSeleccionado - 1, 0, 9);
      this.tiempoBorradoTrazos.establecerObjetivo(tiemposBorradoTrazo[this.tiempoBorradoSeleccionado]);
    } else if (listaContieneTecla(key, teclasAumentarTiempoBorrado)) {        
      this.tiempoBorradoSeleccionado = constrain(this.tiempoBorradoSeleccionado + 1, 0, 9);
      this.tiempoBorradoTrazos.establecerObjetivo(tiemposBorradoTrazo[this.tiempoBorradoSeleccionado]);
    } else {    
      for (let p of pinceles) {
        if (listaContieneTecla(key, p.teclas)) {
          this.pincelSeleccionado = p.indice;
        }
      }
      for (let t of tintasPincel) {
        if (listaContieneTecla(key, t.teclas)) {
          this.tintaPincelSeleccionada = t.indice;
        }
      }
      for (let t of tintasFondo) {
        if (listaContieneTecla(key, t.teclas)) {
          this.tintaFondoSeleccionada = t.indice;
          lienzo.cambiarColor(t);
        }
      }
    }
    if (enviar) {
      if (listaContieneTecla(key, teclasMostrarID)) {
        mostrarID();
      } else if (listaContieneTecla(key, teclasPedirID)) {
        leerID();
      }
      enviarEntradaTeclado(keyCode, key);
    }      
  }
}