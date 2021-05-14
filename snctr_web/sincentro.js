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
}

function draw() {
  estado.actualizar();
  lienzo.pintar();
  pintarCapas();
  estado.mostrar();
}

function mousePressed() {
  estado.iniciarTrazo();
}

function mouseDragged() {
  estado.actualizarTrazo();
}

function mouseReleased() {
  estado.terminarTrazo();
}

function keyPressed() {
  estado.procesarTeclado();
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