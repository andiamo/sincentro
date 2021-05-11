public class NumeroInterpolado {
  float atraccion = 0.1;
  float atenuacion = 0.5;
  float umbral = 0.01;

  float valor;
  float objetivo;
  float velocidad;
  float aceleracion;
  boolean interpolando;

  public NumeroInterpolado(float v) {
    valor = v;
    interpolando = false;
  }

  boolean actualizar() {
    if (interpolando) {
      aceleracion += atraccion * (objetivo - valor);
      velocidad = (velocidad + aceleracion) * atenuacion;
      valor += velocidad;
      aceleracion = 0;
      if (abs(objetivo - valor) >= umbral) {
        return true;
      }
      valor = objetivo;
      interpolando = false;
    }
    return false;
  }

  void establecerObjetivo(float obj) {
    objetivo = obj;
    interpolando = abs(objetivo - valor) >= umbral;
    if (!interpolando) valor = objetivo;
  }
}
