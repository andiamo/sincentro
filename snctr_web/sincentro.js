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

// --- Sketch --- //
var sketch = function (p) {

  p.setup = function () {
    p.configurarPantallaCompleta();
    p.disableScroll();
    p.cursor(p.CROSS);
    
    // https://www.codeleaks.io/get-url-parameter-javascript/
    // https://developer.mozilla.org/en-US/docs/Web/API/Location/search
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const otroID = urlParams.get('peer')
  
    cargarPinceles(p);
    cargarColores(p);  
    crearCapas(p);
  
    lienzo = new LienzoFondo(p);
    estado = new Estado(p);
    mensajes = new Mensajes(p);
    // iu = new Interface();
    // crearInterface();
  
    iniciarP2P(p, otroID);
  
    mostrarPortada(p);    
  };

  p.draw = function () {
    if (mostrandoPortada()) return

    if (!presionInicializada) {
      p.inicializarPresion();
    }
  
    actualizarEstados();
    lienzo.pintar();
    pintarCapas();
    estado.mostrar();
    mensajes.mostrar();
    mostrarInterface();
  
  };

  p.mousePressed = function() {
    if (mostrandoID || mostrandoPortada()) return
    estado.iniciarTrazo(estado.indiceTrazo + 1, p.mouseX, p.mouseY, presion, p.millis(), true);
    return false;
  };  

  p.mouseDragged = function() {
    if (mostrandoID || mostrandoPortada()) return
    estado.actualizarTrazo(estado.indiceTrazo, p.mouseX, p.mouseY, presion, p.millis(), true);
    return false;
  };
  
  p.mouseReleased = function() {
    if (mostrandoID || mostrandoPortada()) return
    estado.terminarTrazo(estado.indiceTrazo, modificador(p) === p.SHIFT, true);
    return false;
  };
  
  p.keyPressed = function() {
    if (mostrandoPortada()) return false
    estado.procesarTeclado(p.keyCode, p.key, true);
    return false;
  };
  
  p.configurarPantallaCompleta = function() {
    let w = 0, h = 0;
    if (typeof(window.innerWidth) === 'number') {
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
    var canvas = p.createCanvas(w, h);
    canvas.parent('sincentro');
    canvas.id("sincentroCanvas");
    canvas.position(0, 0);
  };
  
  // Disabling scrolling and bouncing on iOS Safari
  // https://stackoverflow.com/questions/7768269/ipad-safari-disable-scrolling-and-bounce-effect
  
  p.preventDefault = function(e) {
    e.preventDefault();
  };
  
  p.disableScroll = function() {
    document.body.addEventListener('touchmove', p.preventDefault, { passive: false });
  };
  
  // Initializing Pressure.js
  // https://pressurejs.com/documentation.html
  p.inicializarPresion = function() {
  
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
  
  };

};

// --- Punto de entrada del sketch --- //
let sincentro = new p5(sketch, "sincentro");