var pinceles = [];
var tintasFondo = [];
var tintasPincel = [];
var capas = [];
var lienzo;
var estado;

function setup() {
  configurarPantallaCompleta();
  
  cargarPinceles();  
  cargarColores();  
  crearCapas();

  lienzo = new LienzoFondo();
  estado = new Estado();

  iniciarP2P();

  mostrarPortada();
}

function draw() {
  if (mostrandoPortada) return
  actualizarEstados();
  lienzo.pintar();
  pintarCapas();
  estado.mostrar();
}

function mousePressed() {
  if (mostrandoID || mostrandoPortada) return
  estado.iniciarTrazo(estado.indiceTrazo + 1, mouseX, mouseY, sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY)), millis(), true);
}

function mouseDragged() {
  if (mostrandoID || mostrandoPortada) return
  estado.actualizarTrazo(estado.indiceTrazo, mouseX, mouseY, sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY)), millis(), true);
}

function mouseReleased() {
  if (mostrandoID || mostrandoPortada) return
  estado.terminarTrazo(estado.indiceTrazo, modificador() === SHIFT, true);
}

function keyPressed() {
  if (mostrandoPortada) return
  estado.procesarTeclado(keyCode, key, true);
}

function configurarPantallaCompleta() {
  let w = 0, h = 0;
  if(typeof(window.innerWidth) === 'number') {
    // Non-IE
    w = window.innerWidth;
    h = window.innerHeight;
  } else if(document.documentElement && 
  	        (document.documentElement.clientWidth || 
  	         document.documentElement.clientHeight)) {
    // IE 6+ in 'standards compliant mode'
    w = document.documentElement.clientWidth;
    h = document.documentElement.clientHeight;
  } else if(document.body && (document.body.clientWidth || 
  	                          document.body.clientHeight)) {
    // IE 4 compatible
    w = document.body.clientWidth;
    h = document.body.clientHeight;
  }
  var canvas = createCanvas(w, h);
  canvas.parent('sincentro'); 
}