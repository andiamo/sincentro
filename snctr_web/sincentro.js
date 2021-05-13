var pinceles = [];
var tintasFondo = [];
var tintasPincel = [];

var tiemposTransicionFondo = [0, 500, 1000, 1500, 2000, 3000, 5000, 7000, 10000, 15000];
var lienzo;

var mostrarTextoDeEstado = false;

var tiemposBorradoTrazo = [0, 500, 1000, 1500, 2000, 3000, 5000, 7000, 10000, 15000];
var nivelesOpacidadTrazos = [0, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 1];
var nivelesEscalaTrazos = [0, 0.25, 0.5, 0.75, 1, 2.8, 4.6, 6.4, 8.2, 10.0];

var nuevoTrazo = null;
var registrandoTrazo = false;

var capas = [];
var capaSeleccionada;
var todasCapasSeleccionadas;

var MAX_TRAZOS = 100;
var MAX_TOQUES = 1000;

function setup() {
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
  canvas = createCanvas(w, h);
  canvas.parent('sincentro'); 
  
  cargarPinceles();  
  cargarColores();  
  crearCapas();
  
  lienzo = new LienzoFondo(tintasFondo[0]);

  textFont("Helvetica", 18);

  todasCapasSeleccionadas = false;
  registrandoTrazo = false;
  mostrarTextoDeEstado = true; 

  iniciarP2P();
}

function draw() {  
  lienzo.pintar();
  pintarCapas();  
  if (mostrarTextoDeEstado && !mostrandoID) escribirTextoDeEstado();
}

function mousePressed() {
  if (mostrandoID) return
  if (!registrandoTrazo) {
    registrandoTrazo = true;
    nuevoTrazo = new Trazo(capaSeleccionada, pinceles[capaSeleccionada.pincel].nuevoPincel(), tintasPincel[capaSeleccionada.tinta], capaSeleccionada.repetirTrazos, millis());
  }
  nuevoTrazo.agregarUnToque(crearToque(true));
}

function mouseDragged() {
  if (mostrandoID) return
  if (registrandoTrazo) {
    nuevoTrazo.agregarUnToque(crearToque(false));    
  }  
}

function mouseReleased() {
  if (mostrandoID) return  
  if (registrandoTrazo) {
    if (capaSeleccionada.unirTrazos) {
      nuevoTrazo.toquePrevioEsUltimo();
    } else {
      cerrarTrazo(capaSeleccionada, modificador() === SHIFT);
    }    
  }  
}

function keyPressed() {
  if (key === '1') {
    capaSeleccionada = capas[0];
    todasCapasSeleccionadas = false;
  } else if (key === '2') {
    capaSeleccionada = capas[1];
    todasCapasSeleccionadas = false;
  } else if (key === '3') {
    capaSeleccionada = capas[2];
    todasCapasSeleccionadas = false;
  } else if (key === '4') {
    capaSeleccionada = capas[3];
    todasCapasSeleccionadas = false;
  } else if (key === '5') {
    capaSeleccionada = capas[4];
    todasCapasSeleccionadas = false;
  } else if (key === '6') {
    capaSeleccionada = capas[5];
    todasCapasSeleccionadas = false;
  } else if (key === '7') {
    capaSeleccionada = capas[6];
    todasCapasSeleccionadas = false;
  } else if (key === '8') {
    capaSeleccionada = capas[7];
    todasCapasSeleccionadas = false;
  } else if (key === '9') {
    capaSeleccionada = capas[8];
    todasCapasSeleccionadas = false;
  } else if (key === '0') {
    todasCapasSeleccionadas = true;
  } else if (keyCode === ENTER || keyCode === RETURN) {
    mostrarTextoDeEstado = !mostrarTextoDeEstado;
  } else if (listaContieneTecla(teclasMostrarID)) {
    mostrarID();
  } else if (listaContieneTecla(teclasPedirID)) {
    leerID();
  }
  else if (key == 'p') enviarData();

  lienzo.procesarTeclado();
  for (const capa of capas) {
  if (todasCapasSeleccionadas || capa === capaSeleccionada) {
      capa.procesarTeclado();
    }
  }  
}

function modificador() {
  let mod = -1;
  if (keyPressed) {
    if (keyCode === SHIFT) {
      mod = SHIFT;
    }
  }
  return mod;
}

function escribirTextoDeEstado() {  
  let texto = "";
  if (0 < otrosIDs.size()) texto = "@";
  texto += "C" + capaSeleccionada.indice;
  if (todasCapasSeleccionadas) texto += "!";
  texto += ":" + pinceles[capaSeleccionada.pincel].nombre;
  texto += ":f" + lienzo.tintaActual.nombre;
  texto += ":f" + lienzo.tiempoTransicionSeleccionado;
  texto += ":p" + tintasPincel[capaSeleccionada.tinta].nombre;
  texto += ":p" + capaSeleccionada.tiemposBorradoSeleccionado;
  texto += ":R" + int(capaSeleccionada.repetirTrazos);
  texto += ":U" + int(capaSeleccionada.unirTrazos);
  texto += ":O" + capaSeleccionada.nivelOpacidadSeleccionado;
  texto += ":E" + capaSeleccionada.nivelEscalaSeleccionado;  
  noStroke();
  fill(lienzo.tintaActual.generarColorComplementario());
  text(texto, 0, 0, width, 20);
}