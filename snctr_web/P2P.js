var sketch = null;
var peer = null;

var miID = "";
var otrosIDs = null;
var otrosEstados = null;
var mostrandoID = false;

function iniciarP2P(p, otroId) {
  sketch = p;
  peer = new Peer(); 
  peer.on('open', function(id) {
    miID = id;
    estado.peerID = id;
    conectar(otroId, false, true, false);
  });

  otrosIDs = new HashMap();
  otrosEstados = new HashMap();

  peer.on('connection', function(conn) {
    conn.on('data', function(data) {
      recibirData(conn, data);
    });
  });
  peer.on('disconnected', function() {
    sketch.print("Desconectado del signalling server");
  });
  peer.on('error', function(err) {
    sketch.print("Hubo un error", err);
  });
}

function mostrarID() {
  mostrandoID = !mostrandoID;
  if (mostrandoID) {
    div = sketch.createDiv(miID);
    div.position(0, 0);
    div.size(300, 20);
  } else {
    sketch.removeElements();
  }
}

function leerID() {
  let entrada = window.prompt('Ingresar el codigo del peer');  
  // Este peer intenta conectarse a otro peer usando el id ingresado por el usuario,
  // ademas le enviara un mensaje de HOLA para generar el registro inverso.
  conectar(entrada, false, true, false);  
}

function conectar(id, compartir = false, primera = false, enviar = false) {
  if (!id) return

  if (!otrosIDs.containsKey(id)) {
    if (compartir) compartirNuevoPeer(id);

    let conn = peer.connect(id);

    conn.on('open', function() {
      if (compartir) compartirViejosPeers(conn);
      otrosIDs.put(id, conn);
      sketch.print("AGREGAR peer", conn.peer, otrosIDs.size());
      if (enviar) {
        enviarEstado(conn);
        enviarTrazos(conn);
      }
      if (primera) {
        mensajes.agregar("CONECTADO")
        sketch.print("Enviando mensaje de llegada...")
        conn.send({tipo: "HOLA"});
      }
    });

    conn.on('close', function() {
      otrosIDs.remove(conn.peer);
      sketch.print("REMOVER peer", conn.peer, otrosIDs.size());
    });

  } else {
    sketch.print("Ya estoy conectado con", id);
  }
}

function compartirNuevoPeer(nuevoID) {
  // Compartiendo nuevo peer con los demas...
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "NUEVO_PEER", id : nuevoID});
  }
}

function compartirViejosPeers(conn) {
  // Compartiendo viejos peers con el nuevo...
  for (let otroID of otrosIDs.keys()) {
      conn.send({tipo: "VIEJO_PEER", id : otroID});
  }
}

function recibirData(conn, data) {
  if (data["tipo"] === "HOLA") {
    // Este peer recibe un mensaje de bienvenida de un nuevo peer, ademas de registrarlo, 
    // le avisa a los peers que ya tiene que tambien lo registren.
    conectar(conn.peer, true, false, true);
  } else if (data["tipo"] === "NUEVO_PEER") {
    let id = data["id"]
    conectar(id, false, false, true);
  } else if (data["tipo"] === "VIEJO_PEER") {
    let id = data["id"]
    conectar(id, false, false, false);
  } else if (data["tipo"] === "INICIAR_TRAZO") {
    obtenerEstado(conn.peer).iniciarTrazo(data["indice"], data["posx"], data["posy"], data["pres"], data["millis"], false);
  } else if (data["tipo"] === "ACTUALIZAR_TRAZO") {
    obtenerEstado(conn.peer).actualizarTrazo(data["indice"], data["posx"], data["posy"], data["pres"], data["millis"], false);
  } else if (data["tipo"] === "TERMINAR_TRAZO") {
    obtenerEstado(conn.peer).terminarTrazo(data["indice"], data["unico"], false);
  } else if (data["tipo"] === "ENTRADA_TECLADO") {
    obtenerEstado(conn.peer).procesarTeclado(data["codigo"], data["tecla"], false);
  } else if (data["tipo"] === "TRAZO_COMPLETO") {
    sketch.print("Recibiendo trazo completo de ", conn.peer);
    obtenerEstado(conn.peer).agregarTrazoCompleto(data);
  } else if (data["tipo"] === "TRAZO_INCOMPLETO") {
    sketch.print("Recibiendo trazo en progreso de ", conn.peer);
    obtenerEstado(conn.peer).agregarTrazoIncompleto(data);
  } else if (data["tipo"] === "ESTADO_COMPLETO") {
    sketch.print("Recibiendo estado de", conn.peer);
    obtenerEstado(conn.peer).desempaquetar(data);
  }
}

function obtenerEstado(id) {
  if (otrosEstados.containsKey(id)) {
    return otrosEstados.get(id);
  } else {
    let nuevoEstado = new Estado(sketch, id);
    otrosEstados.put(id, nuevoEstado);
    return nuevoEstado;
  }
}

function enviarEstado(conn) {
  sketch.print("Enviando estado al peer", conn.peer);
  let data = estado.empaquetar();
  data["tipo"] = "ESTADO_COMPLETO";
  conn.send(data);  
}

function enviarTrazos(conn) {
  sketch.print("Enviando trazos completos al peer", conn.peer);
  for (let capa of capas) {
    for (let trazo of capa.trazos) {
      if (estado.peerID === trazo.peer) {
        let data = trazo.empaquetar();
        data["tipo"] = "TRAZO_COMPLETO";
        conn.send(data);
      }
    }
  } 
  if (estado.registrandoTrazo) {
    let data = estado.nuevoTrazo.empaquetar();
    data["tipo"] = "TRAZO_INCOMPLETO";
    conn.send(data);
  }
}

function enviarIniciarTrazo(i, x, y, p, t) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "INICIAR_TRAZO", indice: i, posx : x, posy: y, pres: p, millis: t});
  }
}

function enviarActualizarTrazo(i, x, y, p, t) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "ACTUALIZAR_TRAZO", indice: i, posx : x, posy: y, pres: p, millis: t});
  }  
}

function enviarTerminarTrazo(i, u) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "TERMINAR_TRAZO", indice: i, unico: u});
  }
}

function enviarEntradaTeclado(kc, k) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "ENTRADA_TECLADO", codigo: kc, tecla: k});
  }
}