var NumeroInterpolado = function(p, v) {
  this.p = p;
  this.atraccion = 0.1;
  this.atenuacion = 0.5;
  this.umbral = 0.01;

  this.valor = v;
  this.objetivo = 0;
  this.velocidad = 0;
  this.aceleracion = 0;
  this.interpolando = false;
}

NumeroInterpolado.prototype = {

  actualizar: function() {
    if (this.interpolando) {
      this.aceleracion += this.atraccion * (this.objetivo - this.valor);
      this.velocidad = (this.velocidad + this.aceleracion) * this.atenuacion;
      this.valor += this.velocidad;
      this.aceleracion = 0;
      if (this.p.abs(this.objetivo - this.valor) >= this.umbral) {
        return true;
      }
      this.valor = this.objetivo;
      this.interpolando = false;
    }
    return false;
  },

  establecerObjetivo: function(obj) {
    this.objetivo = obj;
    this.interpolando = this.p.abs(this.objetivo - this.valor) >= this.umbral;
    if (!this.interpolando) this.valor = this.objetivo;
  }
}