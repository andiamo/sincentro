char[] teclasDisminuirTiempoBorrado = {'-', '_'};
char[] teclasAumentarTiempoBorrado  = {'+', '='};

char[] teclasDisminuirTiempoTransicionFondo = {'<', ','};
char[] teclasAumentarTiempoTransicionFondo  = {'>', '.'};

void crearCapas() {
  capas = new ArrayList<CapaDibujo>();
  for (int i = 0; i < 9; i++) {
    capas.add(new CapaDibujo(i + 1));
  }
  capaSeleccionada = capas.get(0);
}

void pintarCapas() {
  for (int i = capas.size() - 1; i >= 0; i--) {
    CapaDibujo capa = capas.get(i);
    capa.pintar();
    if (capa == capaSeleccionada & registrandoTrazo) {
      nuevoTrazo.dibujate();
    }
  }
}

abstract class CapaBase {
  abstract void pintar();
  abstract void procesarTeclado();
  boolean listaContieneTecla(char[] teclas) {
    for (char tcl: teclas) {
      if (tcl == key) return true;
    }
    return false;
  }
}

class LienzoFondo extends CapaBase {
  Tinta tintaActual;
  Tinta tintaPrevia;
  int tiempoCambio;
  boolean cambiando;
  int duracionCambio;
  int tiempoTransicionSeleccionado = 4;
  
  LienzoFondo(Tinta tinta) {
    tintaActual = tinta;
  }
  
  void pintar() {
    color colorFondo;
    if (cambiando) {
      int t = millis();
      if (t - tiempoCambio < duracionCambio) {
        float f = float(t - tiempoCambio) / duracionCambio;      
        colorFondo = tintaPrevia.interpolarHacia(tintaActual, f);        
      } else {
        colorFondo = tintaActual.generarColor();
      }      
    } else {
      colorFondo = tintaActual.generarColor();  
    }
    background(colorFondo);    
  }
  
  void cambiarColor(Tinta tinta) {
    tintaPrevia = tintaActual;
    tintaActual = tinta;
    tiempoCambio = millis();
    cambiando = true;
    duracionCambio = tiemposTransicionFondo[tiempoTransicionSeleccionado];
  }
  
  void procesarTeclado() {
    if (listaContieneTecla(teclasDisminuirTiempoTransicionFondo)) {
      tiempoTransicionSeleccionado = constrain(tiempoTransicionSeleccionado - 1, 0, 9);
    } else if (listaContieneTecla(teclasAumentarTiempoTransicionFondo)) {
      tiempoTransicionSeleccionado = constrain(tiempoTransicionSeleccionado + 1, 0, 9);  
    } else {
      for (Tinta t: tintasFondo) {
        if (listaContieneTecla(t.teclas)) {
          cambiarColor(t);
        }
      }
    }
  }
}

class CapaDibujo extends CapaBase {
  int indice;
  ArrayList<Trazo> trazos;
  int pincel;
  int tinta;

  int tiemposBorradoSeleccionado = 2;
  int nivelOpacidadSeleccionado = 9;
  NumeroInterpolado factorOpacidad;
  int nivelEscalaSeleccionado = 4;
  NumeroInterpolado factorEscala;

  boolean unirTrazos;
  boolean repetirTrazos;
  
  CapaDibujo(int indice) {
    this.indice = indice;
    
    trazos = new ArrayList<Trazo>();  
    factorOpacidad = new NumeroInterpolado(nivelesOpacidadTrazos[nivelOpacidadSeleccionado]);
    factorEscala = new NumeroInterpolado(nivelesEscalaTrazos[nivelEscalaSeleccionado]);

    tinta = 0;
    pincel = 0;

    unirTrazos = false;
    repetirTrazos = true;
  }
  
  void pintar() {
    factorOpacidad.actualizar();
    factorEscala.actualizar();
    
    ArrayList<Trazo> paraRemover = new ArrayList<Trazo>();
    for (Trazo trazo: trazos) {
      trazo.dibujate();
      if (trazo.borrado) paraRemover.add(trazo);
    }
    trazos.removeAll(paraRemover);
  }
  
  void borrarTrazos() {
    for (Trazo trazo: trazos) {
      trazo.borrate();
    }
  }  
  
  void procesarTeclado() {
    if (key == CODED) {    
      if (keyCode == LEFT) {
        nivelOpacidadSeleccionado = constrain(nivelOpacidadSeleccionado - 1, 0, 9);
        factorOpacidad.establecerObjetivo(nivelesOpacidadTrazos[nivelOpacidadSeleccionado]);
      } else if (keyCode == RIGHT) {
        nivelOpacidadSeleccionado = constrain(nivelOpacidadSeleccionado + 1, 0, 9);
        factorOpacidad.establecerObjetivo(nivelesOpacidadTrazos[nivelOpacidadSeleccionado]);
      } else if (keyCode == DOWN) {
        nivelEscalaSeleccionado = constrain(nivelEscalaSeleccionado - 1, 0, 9);
        factorEscala.establecerObjetivo(nivelesEscalaTrazos[nivelEscalaSeleccionado]);
      } else if (keyCode == UP) {
        nivelEscalaSeleccionado = constrain(nivelEscalaSeleccionado + 1, 0, 9);
        factorEscala.establecerObjetivo(nivelesEscalaTrazos[nivelEscalaSeleccionado]);
      }      
    } else {
      if (key == ' ') {
        repetirTrazos = !repetirTrazos;
      } else if (key == DELETE || key == BACKSPACE) {
        borrarTrazos();
      } else if (key == TAB) {      
        unirTrazos = !unirTrazos;
      } else if (listaContieneTecla(teclasDisminuirTiempoBorrado)) {
        tiemposBorradoSeleccionado = constrain(tiemposBorradoSeleccionado - 1, 0, 9);
      } else if (listaContieneTecla(teclasAumentarTiempoBorrado)) {
        tiemposBorradoSeleccionado = constrain(tiemposBorradoSeleccionado + 1, 0, 9);  
      } else {
        for (Pincel p: pinceles) {
          if (listaContieneTecla(p.teclas)) {
            pincel = p.indice;
          }
        }
        for (Tinta t: tintasPincel) {
          if (listaContieneTecla(t.teclas)) {
            tinta = t.indice;
          }
        }
      }
    }
  }
}
