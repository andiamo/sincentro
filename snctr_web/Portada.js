var mostrandoPortada;

function mostrarPortada() {
  createDiv("SINCENTRO").position(10, 10);
  createDiv("Utilize el puntero para dibujar").position(10, 40);
  createDiv("Para activar/desactivar animación de las líneas, use barra espaciadora").position(10, 70);
  createDiv("Para ver su código, presione " + formatearListaDeTeclas(teclasMostrarID)).position(10, 100);
  createDiv("Para ingresar el código de otra persona y dibujar colaborativamente, presione " + formatearListaDeTeclas(teclasPedirID)).position(10, 130);

  createDiv("Con las teclas " + formatearListaDeTeclas(teclasSeleccionUnaCapa) + " puede elegir la capa de dibujo").position(10, 160);
  createDiv("Con las teclas " + formatearListaDeTeclas(obtenerListaTeclasPinceles()) + " puede elegir el pincel").position(10, 190);
  createDiv("Con las teclas " + formatearListaDeTeclas(obtenerListaTeclasTintasPincel()) + " puede elegir el color del pincel").position(10, 220);
  createDiv("Con las teclas " + formatearListaDeTeclas(obtenerListaTeclasTintasFondo()) + " puede elegir el color del fondo").position(10, 250);

  createButton('COMENZAR').position(10, 280).size(100, 30).mousePressed(cerrarPortada);

  mostrandoPortada = true;
}

function cerrarPortada() {
  removeElements();
  mostrandoPortada = false;
}

function formatearListaDeTeclas(lista) {
  if (2 < lista.length) {
    let parte1 = lista.slice(0, lista.length - 2);
    return parte1.toString() + "," + lista[lista.length - 2] + " ó " + lista[lista.length - 1];
  } else if (1 < lista.length) {
    return lista[0] + " ó " + lista[1];
  } else {
    return lista.toString();
  }
}