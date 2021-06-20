var pinceles = [];
var tintasFondo = [];
var tintasPincel = [];
var capas = [];
var lienzo;
var estado;
var mensajes;

function setup() {
  // https://www.codeleaks.io/get-url-parameter-javascript/
  // https://developer.mozilla.org/en-US/docs/Web/API/Location/search
  this.queryString = window.location.search;
  const urlParams = new URLSearchParams(this.queryString);
  const otroID = urlParams.get('peer')
  print(otroID);

  
/*

file:///Users/andres/code/sincentro/snctr_web/index.html?peer=8a853b72-ac5b-45d3-b03a-50a7845ce967

https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
      const shareData = {
        title: 'SINCENTRO',
        text: 'Dibujemos juntos',
        url: 'https://andrescolubri.net/sincentro?peer=' + this.peerID,
      }    

      createButton('COMPARTIR URL').position(10, 310).size(120, 30).mousePressed(async () => {
        try {
          await navigator.share(shareData)
          print('MDN shared successfully');
          // resultPara.textContent = 'MDN shared successfully'
        } catch(err) {
          print('Error: ' + err);
          // resultPara.textContent = 'Error: ' + err
        }
      });
*/


  configurarPantallaCompleta();
  
  cargarPinceles();  
  cargarColores();  
  crearCapas();

  lienzo = new LienzoFondo();
  estado = new Estado();
  mensajes = new Mensajes();

  iniciarP2P(otroID);

  // mostrarPortada();
}

function draw() {
  if (mostrandoPortada()) return
  actualizarEstados();
  lienzo.pintar();
  pintarCapas();
  estado.mostrar();
  mensajes.mostrar();
}

function mousePressed() {
  if (mostrandoID || mostrandoPortada()) return
  estado.iniciarTrazo(estado.indiceTrazo + 1, mouseX, mouseY, sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY)), millis(), true);
  return false;
}

function mouseDragged() {
  if (mostrandoID || mostrandoPortada()) return
  estado.actualizarTrazo(estado.indiceTrazo, mouseX, mouseY, sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY)), millis(), true);
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
}