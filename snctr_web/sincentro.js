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
  iniciarP2P();

  lienzo = new LienzoFondo();
  estado = new Estado(miID);  
}

function draw() {
  estado.actualizar();
  lienzo.pintar();
  pintarCapas();
  estado.mostrar();
}

function mousePressed() {
  estado.iniciarTrazo(mouseX, mouseY, sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY)), millis());
}

function mouseDragged() {
  estado.actualizarTrazo(mouseX, mouseY, sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY)), millis());
}

function mouseReleased() {
  estado.terminarTrazo(modificador() === SHIFT);
}

function keyPressed() {
  estado.procesarTeclado(keyCode, key);
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