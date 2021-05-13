var Estado = function() {
  this.nuevoTrazo = null;

  this.capaSeleccionada = 0;
  this.todasCapasSeleccionadas = false;    
  this.registrandoTrazo = false;
  this.mostrarTextoDeEstado = false;
  this.mostrandoID = false;

  // Por capa
  this.tiemposBorradoSeleccionado = 2;
  this.nivelOpacidadSeleccionado = 9;
  this.nivelEscalaSeleccionado = 4; 
  this.pincel = 0;
  this.tinta = 0;
  this.unirTrazos = false;
  this.repetirTrazos = true;  
}