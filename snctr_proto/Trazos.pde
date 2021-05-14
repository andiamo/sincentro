import java.util.List;

Toque crearToque(boolean primero) {
  float p = sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY));
  Toque toque = new Toque(mouseX, mouseY, p, millis());
  toque.primero = primero;
  return toque;
}

void cerrarTrazo(CapaDibujo capa, boolean unico) {  
  if (capa.trazos.size() == MAX_TRAZOS) capa.trazos.remove(0);
  estado.nuevoTrazo.cerrate(unico);
  capa.trazos.add(estado.nuevoTrazo);
  estado.registrandoTrazo = false;
}

class Trazo {
  CapaDibujo capa;
  Pincel pincel;
  Tinta tinta;
  float factorOpacidad;
  float factorEscala;
  ArrayList<Toque> toques;
  Toque[] atoques;
  int tiempoComienzo;
  int tiempoBorrado;
  int tiempoFinal;
  boolean repetir;
  boolean cerrado;
  boolean borrando;
  boolean borrado;
  int duracionBorrado;
  int indicePrevio;
  
  Trazo(CapaDibujo capa, Pincel pincel, Tinta tinta, float factorOpacidad, float factorEscala, boolean rep, int t) {    
    this.capa = capa;
    this.pincel = pincel;
    this.tinta = tinta;
    this.factorOpacidad = factorOpacidad;
    this.factorEscala = factorEscala;
    
    toques = new ArrayList<Toque>();
    
    tiempoComienzo = t;
    atoques = new Toque[0];
    repetir = rep;
    cerrado = false;
    borrando = false;
    borrado = false;
  }
  
  void cerrate(boolean unico) {
    cerrado = true;
    duracionBorrado = int(estado.tiempoBorradoTrazos.valor);
    Toque ultimoToque = toques.get(toques.size() - 1);  
    Toque fakeToque = new Toque(ultimoToque.x, ultimoToque.y, ultimoToque.p, ultimoToque.t + duracionBorrado);
    tiempoBorrado = ultimoToque.t;
    agregarUnToque(fakeToque);
    ultimoToque.ultimo = true;
    borrando = unico;
  }

  void dibujate(float opacidadCapa) {
    if (factorOpacidad == 0 || factorEscala == 0) return;
    
    int indice = toques.size() - 1;
    float factorBorrado = 1;
    if (cerrado && (repetir || borrando)) {
      
      int t = (millis() - tiempoComienzo) % (tiempoFinal - tiempoComienzo + 1);
      int indiceCorriente = buscarIndice(t);      
      if (repetir) {
        // Transformar tiempo absoluto (millis) en tiempo relativo al trazo:        
        indice = indiceCorriente;
      }
      
      if (tiempoBorrado - tiempoComienzo <= t) {
        factorBorrado = 1 - float(t - tiempoBorrado + tiempoComienzo) / duracionBorrado;        
      }
      
      if (borrando && (indiceCorriente < indicePrevio || factorBorrado < 0.01)) {
        borrado = true;
        borrando = false;
        return;
      }
      
      indicePrevio = indiceCorriente;
    }

    List<Toque> list = toques.subList(0, indice + 1);
    atoques = list.toArray(new Toque[indice + 1]);
    float opacidad = constrain(opacidadCapa * factorOpacidad * factorBorrado * 255, 1, 255);
    pincel.pintar(atoques, tinta.generarColor(opacidad), factorEscala);
  }
  
  void borrate() {
    borrando = true;
  }
  
  void agregarUnToque(Toque toque) {
    if (toques.size() == MAX_TOQUES) toques.remove(0);
    toques.add(toque);
    tiempoFinal = toque.t;
  }
  
  void toquePrevioEsUltimo() {
    if (0 < toques.size()) {
      Toque toque = toques.get(toques.size() - 1);
      toque.ultimo = true;
    }    
  }  
  
  int buscarIndice(int tiempo) {
    int n = toques.size();
    int mini = 0;
    int maxi = n;
    int idx = mini + (maxi - mini)/2;
    int iter = 0;
    while (iter < n) {
      int t0 = toques.get(idx).t - tiempoComienzo;
      int t1;
      if (idx < n - 1) {
        t1 = toques.get(idx + 1).t - tiempoComienzo;
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
      idx = mini + (maxi - mini)/2;
      iter++; 
    }
    return idx;
  }  
}

class Toque {
  int x;
  int y;
  int t;
  float p;
  boolean primero;
  boolean ultimo;
  
  Toque(int x, int y, float p, int t) {
    this.x = x;
    this.y = y;
    this.t = t;
    this.p = p;
    primero = false;
    ultimo = false;    
  }  
}
