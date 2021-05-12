// Documentacion de la API:
// https://peerjs.com/docs.html

// Ejemplos:
// https://github.com/nwah/peerjs-audio-chat
//https://github.com/peers/peerjs/issues/179

var teclasMostrarID = [';', ':'];
var teclasPedirID  = ['/', '?'];

var peer = null;
var conexion = null;

var miID = "";
var mostrandoID = false;
var leyendoID = false;
var conectado = false;

function iniciarP2P() {
  peer = new Peer(); 
  peer.on('open', function(id) {
    miID = id;
  });

  peer.on('connection', function(conn) {
    conn.on('data', function(data) {            
      print("Recibido", data, 'from', conn.peer);
      if (!conectado) conectar(conn.peer);
    });
  });
}

function mostrarID() {
  mostrandoID = !mostrandoID;
  if (leyendoID) {
    leyendoID = false;
    removeElements();
  }
  if (mostrandoID) {
    div = createDiv(miID);
    div.position(0, 0);
    div.size(500, 20);    
  } else {
    removeElements();
  }
}

function leerID() {
  leyendoID = !leyendoID;
  if (mostrandoID) {
    mostrandoID = false;
    removeElements();
  }  
  if (leyendoID) {
    entrada = createInput();
    entrada.position(0, 0);
    entrada.size(500, 20);
    boton = createButton('Conectar');
    boton.position(520, 0);
    boton.size(80, 28);
    boton.mousePressed(procesarEntrada);  
  } else {
    removeElements();
  }
}

function procesarEntrada() {
  leyendoID = false;  
  removeElements();
  conectar(entrada.value());
}

function conectar(id) {
  conexion = peer.connect(id);
  conexion.on('open', function() {
    conectado = true;
  });    
}

function enviarData() {
  print("Enviando data");
  conexion.send({x : mouseX, y : mouseY});
}