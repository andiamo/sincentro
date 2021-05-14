char[] teclasDisminuirTiempoBorrado = {'-', '_'};
char[] teclasAumentarTiempoBorrado  = {'+', '='};

char[] teclasDisminuirTiempoTransicionFondo = {'<', ','};
char[] teclasAumentarTiempoTransicionFondo  = {'>', '.'};

char[] teclasSeleccionUnaCapas = {'1', '2', '3', '4', '5', '6', '7', '8', '9'};
char[] teclasSeleccionAllCapas = {'0'};

boolean listaContieneTecla(char[] teclas) {
  for (char tcl: teclas) {
    if (tcl == key) return true;
  }
  return false;
}

int modificador() {
  int mod = -1;
  if (keyPressed) {
    if (key == CODED) {
      if (keyCode == SHIFT) {
        mod = SHIFT;
      }
    }
  }
  return mod;
}

class Estado {
  Trazo nuevoTrazo;
  boolean registrandoTrazo;
  int pincelSeleccionado;
  int tintaPincelSeleccionada;
  int tintaFondoSeleccionada;
  int capaSeleccionada;
  boolean todasCapasSeleccionadas;
  boolean unirTrazos;
  boolean repetirTrazos;
  int tiempoTransicionFondoSeleccionado;

  boolean mostrarTextoDeEstado;
  int tiemposBorradoSeleccionado = 2;
  int nivelOpacidadSeleccionado = 9;
  NumeroInterpolado factorOpacidadTrazos;
  int nivelEscalaSeleccionado = 4;
  NumeroInterpolado factorEscalaTrazos;
  
  Estado() {
    capaSeleccionada = 0;
    pincelSeleccionado = 0;
    tintaPincelSeleccionada = 0;  
    tintaFondoSeleccionada = 0;
    todasCapasSeleccionadas = false;
    registrandoTrazo = false;
    mostrarTextoDeEstado = true;
    unirTrazos = false;
    repetirTrazos = true;
    tiempoTransicionFondoSeleccionado = 4;
    factorOpacidadTrazos = new NumeroInterpolado(nivelesOpacidadTrazos[nivelOpacidadSeleccionado]);
    factorEscalaTrazos = new NumeroInterpolado(nivelesEscalaTrazos[nivelEscalaSeleccionado]);
    textFont(createFont("Helvetica", 18));
  }
  
  void actualizar() {
    factorOpacidadTrazos.actualizar();
    factorEscalaTrazos.actualizar();    
  }
  
  void iniciarTrazo() {
    if (!registrandoTrazo) {    
      registrandoTrazo = true;
      nuevoTrazo = new Trazo(capas.get(capaSeleccionada), 
                             pinceles.get(pincelSeleccionado).nuevoPincel(), 
                             tintasPincel.get(tintaPincelSeleccionada), 
                             repetirTrazos, millis());
    }
    nuevoTrazo.agregarUnToque(crearToque(true));    
  }
  
  void actualizarTrazo() {
    if (registrandoTrazo) {
      nuevoTrazo.agregarUnToque(crearToque(false));
    } 
  }

  void terminarTrazo() {
    if (registrandoTrazo) {
      if (unirTrazos) {
        nuevoTrazo.toquePrevioEsUltimo();
      } else {
        cerrarTrazo(capas.get(capaSeleccionada), modificador() == SHIFT);
      }
    }
  }     
  
  void mostrar() {
    if (mostrarTextoDeEstado) {
      String texto = "";
      texto = "C" + (capaSeleccionada + 1);
      if (todasCapasSeleccionadas) texto += "!";
      texto += ":" + pinceles.get(pincelSeleccionado).nombre;
      texto += ":f" + tintasFondo.get(tintaFondoSeleccionada).nombre;
      texto += ":f" + tiempoTransicionFondoSeleccionado;
      texto += ":p" + tintasPincel.get(tintaPincelSeleccionada).nombre;
      texto += ":p" + tiemposBorradoSeleccionado;  
      texto += ":R" + int(repetirTrazos);
      texto += ":U" + int(unirTrazos);
      texto += ":O" + nivelOpacidadSeleccionado;
      texto += ":E" + nivelEscalaSeleccionado;
      fill(lienzo.tintaActual.generarColorComplementario());  
      text(texto, 0, 0, width, 20);      
    }
  }
  
  void procesarTeclado() {
    if (key == CODED) {
      if (keyCode == LEFT) {
        nivelOpacidadSeleccionado = constrain(nivelOpacidadSeleccionado - 1, 0, 9);
        factorOpacidadTrazos.establecerObjetivo(nivelesOpacidadTrazos[nivelOpacidadSeleccionado]);
      } else if (keyCode == RIGHT) {
        nivelOpacidadSeleccionado = constrain(nivelOpacidadSeleccionado + 1, 0, 9);
        factorOpacidadTrazos.establecerObjetivo(nivelesOpacidadTrazos[nivelOpacidadSeleccionado]);
      } else if (keyCode == DOWN) {
        nivelEscalaSeleccionado = constrain(nivelEscalaSeleccionado - 1, 0, 9);
        factorEscalaTrazos.establecerObjetivo(nivelesEscalaTrazos[nivelEscalaSeleccionado]);
      } else if (keyCode == UP) {
        nivelEscalaSeleccionado = constrain(nivelEscalaSeleccionado + 1, 0, 9);
        factorEscalaTrazos.establecerObjetivo(nivelesEscalaTrazos[nivelEscalaSeleccionado]);
      }
    } else {
      if (key == ' ') {
        repetirTrazos = !repetirTrazos;
      } else if (key == TAB) {      
        unirTrazos = !unirTrazos;
      } else if (listaContieneTecla(teclasSeleccionUnaCapas)) {
        capaSeleccionada = Character.getNumericValue(key) - 1;      
        todasCapasSeleccionadas = false;
      } else if (listaContieneTecla(teclasSeleccionAllCapas)) {
        todasCapasSeleccionadas = true;
      } else if (keyCode == ENTER || keyCode == RETURN) {
        mostrarTextoDeEstado = !mostrarTextoDeEstado;
      } else if (listaContieneTecla(teclasDisminuirTiempoTransicionFondo)) {
        tiempoTransicionFondoSeleccionado = constrain(tiempoTransicionFondoSeleccionado - 1, 0, 9);
      } else if (listaContieneTecla(teclasAumentarTiempoTransicionFondo)) {
        tiempoTransicionFondoSeleccionado = constrain(tiempoTransicionFondoSeleccionado + 1, 0, 9);  
      } else if (listaContieneTecla(teclasDisminuirTiempoBorrado)) {
        tiemposBorradoSeleccionado = constrain(tiemposBorradoSeleccionado - 1, 0, 9);
      } else if (listaContieneTecla(teclasAumentarTiempoBorrado)) {
        tiemposBorradoSeleccionado = constrain(tiemposBorradoSeleccionado + 1, 0, 9);  
      } else if (key == DELETE || key == BACKSPACE) {
        if (todasCapasSeleccionadas) {
          for (CapaDibujo capa: capas) capa.borrarTrazos();
        } else {
          capas.get(capaSeleccionada).borrarTrazos();
        }
      } else {    
        for (Pincel p: pinceles) {
          if (listaContieneTecla(p.teclas)) {
            pincelSeleccionado = p.indice;
          }
        }
        for (Tinta t: tintasPincel) {
          if (listaContieneTecla(t.teclas)) {
            tintaPincelSeleccionada = t.indice;
          }
        }
        for (Tinta t: tintasFondo) {
          if (listaContieneTecla(t.teclas)) {
            tintaFondoSeleccionada = t.indice;
            lienzo.cambiarColor(t);
          }
        }
      }
    }
  }
}
