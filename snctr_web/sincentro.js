var pinceles = [];
var tintasFondo = [];
var tintasPincel = [];
var lienzo;
var indiceTrazo = 0;

var nuevoTrazo = null;
var registrandoTrazo = false;

var capas = [];
var capaSeleccionada;
var todasCapasSeleccionadas;

var mostrarTextoDeEstado = false;



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
  var canvas = createCanvas(w, h);
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
    let scapa = capas[capaSeleccionada];
    registrandoTrazo = true;
    indiceTrazo++;    
    nuevoTrazo = new Trazo(indiceTrazo, miID, scapa, pinceles[scapa.pincel].nuevoPincel(), tintasPincel[scapa.tinta], scapa.repetirTrazos, millis());
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
    let scapa = capas[capaSeleccionada];
    if (scapa.unirTrazos) {
      nuevoTrazo.toquePrevioEsUltimo();
    } else {
      cerrarTrazo(scapa, modificador() === SHIFT);
    }    
  }  
}

function keyPressed() {
  if (listaContieneTecla(teclasSeleccionUnaCapas)) {
    capaSeleccionada = int(key) - 1;
    todasCapasSeleccionadas = false;
  } else if (listaContieneTecla(teclasSeleccionAllCapas)) {
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
  if (todasCapasSeleccionadas) {
    for (const capa of capas) capa.procesarTeclado();
  } else {
    capas[capaSeleccionada].procesarTeclado();
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
  let scapa = capas[capaSeleccionada];
  let texto = "";
  if (0 < otrosIDs.size()) texto = "@";
  texto += "C" + scapa.indice;
  if (todasCapasSeleccionadas) texto += "!";
  texto += ":" + pinceles[scapa.pincel].nombre;
  texto += ":f" + lienzo.tintaActual.nombre;
  texto += ":f" + lienzo.tiempoTransicionSeleccionado;
  texto += ":p" + tintasPincel[scapa.tinta].nombre;
  texto += ":p" + scapa.tiemposBorradoSeleccionado;
  texto += ":R" + int(scapa.repetirTrazos);
  texto += ":U" + int(scapa.unirTrazos);
  texto += ":O" + scapa.nivelOpacidadSeleccionado;
  texto += ":E" + scapa.nivelEscalaSeleccionado;  
  noStroke();
  fill(lienzo.tintaActual.generarColorComplementario());
  text(texto, 0, 0, width, 20);
}