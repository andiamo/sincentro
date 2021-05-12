void cargarColores() {
  tintasFondo = new ArrayList<Tinta>();
  tintasPincel = new ArrayList<Tinta>();
  
  tintasFondo.add(new Tinta(0, "BL", new char[]{'Z', 'z'}, #FFFFFF));
  tintasFondo.add(new Tinta(1, "NG", new char[]{'X', 'x'}, #000000));  
    
  tintasPincel.add(new Tinta(0, "NG", new char[]{'A', 'a'}, #171717));
  tintasPincel.add(new Tinta(1, "BL", new char[]{'S', 's'}, #F7F7F7));
  tintasPincel.add(new Tinta(2, "RJ", new char[]{'D', 'd'}, #EA8879));
  tintasPincel.add(new Tinta(3, "VR", new char[]{'F', 'f'}, #A6EA6B));
  tintasPincel.add(new Tinta(4, "AZ", new char[]{'G', 'g'}, #4EC7EA));
}

class Tinta {
  int indice;
  String nombre;
  char[] teclas;
  float rojo;
  float verde;
  float azul;
  
  Tinta(int indice, String name, char[] teclas, color c) {
    this.indice = indice;
    this.nombre = name;
    this.teclas = teclas;
    
    rojo = red(c);
    verde = green(c);
    azul = blue(c);
  }
  
  color generarColor() {
    return generarColor(255);      
  }

  color generarColor(float opacidad) {
    return color(rojo, verde, azul, opacidad);      
  }  

  color generarColorComplementario() {
    return generarColorComplementario(255);      
  }
  
  color generarColorComplementario(float opacidad) {
    return color(255 - rojo, 255 - verde, 255 - azul, opacidad);      
  }
  
  color interpolarHacia(Tinta destino, float factor) {
    return lerpColor(generarColor(), destino.generarColor(), factor);
  }
}
