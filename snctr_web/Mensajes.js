var Mensajes = function() {
  this.mensaje = "";
  this.tiempoAbrir = 0;
}

Mensajes.prototype = {
  mostrar: function() {
    if (this.mensaje) {
      noStroke();      
      fill(lienzo.tintaActual.generarColorComplementario());
      textFont("Helvetica", 40);
      textAlign(CENTER, CENTER);
      text(this.mensaje, 0, 0, width, height);        
      if (2000 < millis() - this.tiempoAbrir) {
        this.mensaje = "";
      }
    }
  },

  agregar: function(mensaje) {
    this.mensaje = mensaje;
    this.tiempoAbrir = millis();
  }
}