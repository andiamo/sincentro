ArrayList<Pincel> pinceles;
ArrayList<Tinta> tintasFondo;
ArrayList<Tinta> tintasPincel;
ArrayList<CapaDibujo> capas;
LienzoFondo lienzo;
Estado estado;

void setup() {
  size(1200, 800, P2D);
  cargarPinceles();
  cargarColores();
  crearCapas();
  lienzo = new LienzoFondo();
  estado = new Estado();
}

void draw() {
  estado.actualizar();
  lienzo.pintar();
  pintarCapas();  
  estado.mostrar();
}

void mousePressed() {  
  estado.iniciarTrazo();
}

void mouseDragged() {
  estado.actualizarTrazo();
}

void mouseReleased() {
  estado.terminarTrazo();
}

void keyPressed() {
  estado.procesarTeclado();
}
