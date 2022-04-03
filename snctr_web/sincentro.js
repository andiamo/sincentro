var pinceles = [];
var tintasFondo = [];
var tintasPincel = [];
var capas = [];
var lienzo;
var estado;
var mensajes;
// var iu;

var presionInicializada = false;
var presion = -2;
var presionEscala = 5;

function setup() {
  configurarPantallaCompleta();
  disableScroll();
  cursor(CROSS);
  
  // https://www.codeleaks.io/get-url-parameter-javascript/
  // https://developer.mozilla.org/en-US/docs/Web/API/Location/search
  this.queryString = window.location.search;
  const urlParams = new URLSearchParams(this.queryString);
  const otroID = urlParams.get('peer')

  cargarPinceles();  
  cargarColores();  
  crearCapas();

  lienzo = new LienzoFondo();
  estado = new Estado();
  mensajes = new Mensajes();
  // iu = new Interface();
  crearInterface();

  iniciarP2P(otroID);

  mostrarPortada();
}

function draw() {
  if (mostrandoPortada()) return

  if (!presionInicializada) {
    inicializarPresion();
  }

  actualizarEstados();
  lienzo.pintar();
  pintarCapas();
  estado.mostrar();
  mensajes.mostrar();
  mostrarInterface();
}

function mousePressed() {
  if (mostrandoID || mostrandoPortada()) return
  estado.iniciarTrazo(estado.indiceTrazo + 1, mouseX, mouseY, presion, millis(), true);
  return false;
}

function mouseDragged() {
  if (mostrandoID || mostrandoPortada()) return
  estado.actualizarTrazo(estado.indiceTrazo, mouseX, mouseY, presion, millis(), true);
  return false;
}

function mouseReleased() {
  if (mostrandoID || mostrandoPortada()) return
  estado.terminarTrazo(estado.indiceTrazo, modificador() === SHIFT, true);
  return false;
}

function keyPressed() {
  if (mostrandoPortada()) return false
  estado.procesarTeclado(keyCode, key, true);
  return false;
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
  canvas.id("sincentroCanvas");
  canvas.position(0, 0);
}

// Disabling scrolling and bouncing on iOS Safari
// https://stackoverflow.com/questions/7768269/ipad-safari-disable-scrolling-and-bounce-effect

function preventDefault(e){
  e.preventDefault();
}

function disableScroll(){
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

// Initializing Pressure.js
// https://pressurejs.com/documentation.html
function inicializarPresion() {

  //console.log("Attempting to initialize Pressure.js ");

  Pressure.set('#sincentroCanvas', {

    start: function(event){
      // this is called on force start
      // isDrawing = true;
      // isDrawingJustStarted = true;
    },
    end: function(){
      // this is called on force end
      // isDrawing = false
      presion = 0;
    },
    change: function(force, event) {
      if (!presionInicializada){
        console.log("Pressure.js initialized successfully");
        presionInicializada = true;
      }
      //console.log(force);
      presion = presionEscala * force;

    }
  });

  Pressure.config({
    polyfill: true, // use time-based fallback ?
    polyfillSpeedUp: 1000, // how long does the fallback take to reach full pressure
    polyfillSpeedDown: 300,
    preventSelect: true,
    only: null
    });

}