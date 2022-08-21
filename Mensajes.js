var Mensajes = function(p) {
  this.p = p;
  this.mensaje = "";
  this.tiempoAbrir = 0;
}

Mensajes.prototype = {
  mostrar: function() {
    let p = this.p;
    if (this.mensaje) {
      p.noStroke();      
      p.fill(lienzo.tintaActual.generarColorComplementario());
      p.textFont("Helvetica", 40);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.mensaje, 0, 0, p.width, p.height);
      if (2000 < p.millis() - this.tiempoAbrir) {
        this.mensaje = "";
      }
    }
  },

  agregar: function(mensaje) {
    this.mensaje = mensaje;
    this.tiempoAbrir = this.p.millis();
  }
}