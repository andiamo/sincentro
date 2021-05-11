ArrayList<Pincel> pinceles;
ArrayList<Tinta> tintasFondo;
ArrayList<Tinta> tintasPincel;

int[] tiemposTransicionFondo = {0, 500, 1000, 1500, 2000, 3000, 5000, 7000, 10000, 15000};
LienzoFondo lienzo;

boolean mostrarTextoDeEstado;

int[] tiemposBorradoTrazo = {0, 500, 1000, 1500, 2000, 3000, 5000, 7000, 10000, 15000};
float[] nivelesOpacidadTrazos = {0, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 1};
float[] nivelesEscalaTrazos = {0, 0.25, 0.5, 0.75, 1, 2.8, 4.6, 6.4, 8.2, 10.0};

Trazo nuevoTrazo;
boolean registrandoTrazo;

ArrayList<CapaDibujo> capas;
CapaDibujo capaSeleccionada;
boolean todasCapasSeleccionadas;

int MAX_TRAZOS = 100;
int MAX_TOQUES = 1000;

void setup() {
  size(1200, 800, P2D);  
  
  cargarPinceles();  
  cargarColores();  
  crearCapas();
  
  lienzo = new LienzoFondo(tintasFondo.get(0));

  textFont(createFont("Helvetica", 18));

  todasCapasSeleccionadas = false;
  registrandoTrazo = false;
  mostrarTextoDeEstado = true; 
}

void draw() {
  lienzo.pintar();
  pintarCapas();  
  if (mostrarTextoDeEstado) escribirTextoDeEstado();
}

void mousePressed() {
  if (!registrandoTrazo) {
    registrandoTrazo = true;
    nuevoTrazo = new Trazo(capaSeleccionada, pinceles.get(capaSeleccionada.pincel).nuevoPincel(), tintasPincel.get(capaSeleccionada.tinta), capaSeleccionada.repetirTrazos, millis());
  }
  nuevoTrazo.agregarUnToque(crearToque(true));
}

void mouseDragged() {
  if (registrandoTrazo) {
    nuevoTrazo.agregarUnToque(crearToque(false));
  }  
}

void mouseReleased() {
  if (registrandoTrazo) {
    if (capaSeleccionada.unirTrazos) {
      nuevoTrazo.toquePrevioEsUltimo();
    } else {
      cerrarTrazo(capaSeleccionada, modificador() == SHIFT);
    }    
  }  
}

void keyPressed() {
  if (key == '1') {
    capaSeleccionada = capas.get(0);
    todasCapasSeleccionadas = false;
  } else if (key == '2') {
    capaSeleccionada = capas.get(1);
    todasCapasSeleccionadas = false;
  } else if (key == '3') {
    capaSeleccionada = capas.get(2);
    todasCapasSeleccionadas = false;
  } else if (key == '4') {
    capaSeleccionada = capas.get(3);
    todasCapasSeleccionadas = false;
  } else if (key == '5') {
    capaSeleccionada = capas.get(4);
    todasCapasSeleccionadas = false;
  } else if (key == '6') {
    capaSeleccionada = capas.get(5);
    todasCapasSeleccionadas = false;
  } else if (key == '7') {
    capaSeleccionada = capas.get(6);
    todasCapasSeleccionadas = false;
  } else if (key == '8') {
    capaSeleccionada = capas.get(7);
    todasCapasSeleccionadas = false;
  } else if (key == '9') {
    capaSeleccionada = capas.get(8);
    todasCapasSeleccionadas = false;
  } else if (key == '0') {      
    todasCapasSeleccionadas = true;   
  } else if (keyCode == ENTER || keyCode == RETURN) {
    mostrarTextoDeEstado = !mostrarTextoDeEstado;
  }
  lienzo.procesarTeclado(); 
  for (CapaDibujo capa: capas) {
    if (todasCapasSeleccionadas || capa == capaSeleccionada) {
      capa.procesarTeclado();
    }
  }  
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

void escribirTextoDeEstado() {  
  String texto = "";
  texto = "C" + capaSeleccionada.indice;
  if (todasCapasSeleccionadas) texto += "!";
  texto += ":" + pinceles.get(capaSeleccionada.pincel).nombre;
  texto += ":f" + lienzo.tintaActual.nombre;
  texto += ":f" + lienzo.tiempoTransicionSeleccionado;
  texto += ":p" + tintasPincel.get(capaSeleccionada.tinta).nombre;
  texto += ":p" + capaSeleccionada.tiemposBorradoSeleccionado;  
  texto += ":R" + int(capaSeleccionada.repetirTrazos);
  texto += ":U" + int(capaSeleccionada.unirTrazos);
  texto += ":O" + capaSeleccionada.nivelOpacidadSeleccionado;
  texto += ":E" + capaSeleccionada.nivelEscalaSeleccionado;
  fill(lienzo.tintaActual.generarColorComplementario());  
  text(texto, 0, 0, width, 20);
}
