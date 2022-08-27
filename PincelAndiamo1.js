var RIBBON_WIDTH = 0.4; // Average ribbon width
var SMOOTH_COEFF = 0.7; // Smoothing coefficient used to ease the jumps in the tracking data.
var RIBBON_DETAIL = 5;
var MIN_POS_CHANGE = 2;
var NORM_FACTOR = 5;  // This factor allows to normalize ribbon width with respect to the speed of the
                      // drawing, so that all ribbons have approximately same width.
var MIN_CTRL_CHANGE = 5;
var TEXCOORDU_INC = 0.1;

var INVISIBLE_ALPHA = 1;    // Alpha at which a stroke is considered invisible

var PincelAndiamo1 = function(p, indice, nombre, teclas) { 
    this.p = p;
    this.indice = indice;
    this.nombre = nombre;
    this.teclas = teclas;

    this.ribbonDetail = 0;
    this.nVertPerStretch = 0;
    this.nControl = 0;
    this.lspline = null;
    this.rspline = null;
  
    this.oldX = 0,
    this.oldY = 0,
    this.oldZ = 0;
  
    this.newX = 0;
    this.newY = 0;
    this.newZ = 0;
  
    this.oldVel = 0;
    this.newVel = 0;
    this.twist = 0;
    this.ribbonsWidth = 0;
  
    this.pX0 = 0;
    this.pY0 = 0;
  
    this.pX = 0;
    this.pY = 0;
  
    this.uTexCoord = 0;
    this.Sid1Point0 = null;
    this.Sid1Point1 = null;
    this.Sid2Point0 = null;
    this.Sid2Point1 = null;

    this.quads = [];
    this.quadCount = [];

    this.initRibbons();
  }
  
PincelAndiamo1.prototype = {  
  nuevoPincel: function() {
    return new PincelAndiamo1(this.p, this.indice, this.nombre, this.teclas);
  },

  initRibbons: function() {
    this.ribbonDetail = RIBBON_DETAIL;
    this.nVertPerStretch = 0;
    for (let ui = 1; ui <= 10; ui ++) {
      if (ui % this.ribbonDetail == 0) {
        this.nVertPerStretch += 4;
      }
    }
    this.lspline = new BSpline(true);
    this.rspline = new BSpline(true);
    this.ribbonsWidth = 0.7 * RIBBON_WIDTH + 1.3 * RIBBON_WIDTH * Math.random();    
  },

  addPointToRibbon: function(x, y, tinta, escala,  starting) {
    this.pX = x;
    this.pY = y;
  
    if (starting) {
      // (x, y) is the first position, so initializing the previous position to this one.
      this.pX0 = this.pX;
      this.pY0 = this.pY;
      this.nControl = 0;
      return;
    }
  
    // Discarding steps that are too small.
    if (Math.abs(this.pX - this.pX0) < MIN_POS_CHANGE &&
        Math.abs(this.pY - this.pY0) < MIN_POS_CHANGE) return;
    this.pX0 = this.pX;
    this.pY0 = this.pY;
  
    if (this.nControl == 4) {
      this.lspline.shiftBSplineCPoints();
      this.rspline.shiftBSplineCPoints();
    } else {
      // Initializing the first 4 control points
      var p1 = this.p.createVector(this.pX, this.pY, 0);
      var p0 = this.p.createVector(this.pX0, this.pY0, 0);
      var p10 = p5.Vector.sub(p0, p1);
      var p_1 = p5.Vector.add(p0, p10);
      var p_2 = p5.Vector.add(p_1, p10);
  
      this.lspline.setCPoint(0, p_2);
      this.lspline.setCPoint(1, p_1);
      this.lspline.setCPoint(2, p0);
      this.lspline.setCPoint(3, p1);
  
      this.rspline.setCPoint(0, p_2);
      this.rspline.setCPoint(1, p_1);
      this.rspline.setCPoint(2, p0);
      this.rspline.setCPoint(3, p1);
  
      this.newX = this.pX;
      this.newY = this.pY;
      this.newZ = 0;
  
      this.nControl = 4;
    }
  
    this.oldX = this.newX;
    this.oldY = this.newY;
    this.oldZ = this.newZ;
    this.newX = SMOOTH_COEFF * this.oldX + (1 - SMOOTH_COEFF) * this.pX;
    this.newY = SMOOTH_COEFF * this.oldY + (1 - SMOOTH_COEFF) * this.pY;
    this.newZ = 0;
  
    var dX = this.newX - this.oldX;
    var dY = this.newY - this.oldY;
    var dZ = this.newZ - this.oldZ;
  
    var nX = +dY;
    var nY = -dX;
    var nZ = 0;
  
    var dir = this.p.createVector(dX, dY, dZ);
    var nor = this.p.createVector(nX, nY, nZ);
    this.oldVel = this.newVel;
    var l = dir.mag();
    this.newVel = escala * this.ribbonsWidth / this.p.map(l, 0, 100, 1, NORM_FACTOR + 0.1);
  
    this.addControlPoint(this.lspline, this.newX, this.newY, this.newZ, nor, +this.newVel);
    this.addControlPoint(this.rspline, this.newX, this.newY, this.newZ, nor, -this.newVel);
  
    var r = this.p.red(tinta);
    var g = this.p.green(tinta);
    var b = this.p.blue(tinta);
    var a = this.p.alpha(tinta);
    this.addRibbonStretch(this.lspline, this.rspline, r, g, b, a);
  },

  addControlPoint: function(spline, newX, newY, newZ, nor, vel) {
    var addCP = true;
    var cp1 = this.p.createVector(newX - vel * nor.x, newY - vel * nor.y, newZ - vel * nor.z);
    if (1 < this.nControl) {
      var cp0 = this.p.createVector(0, 0);
      spline.getCPoint(this.nControl - 2, cp0);
      addCP = MIN_CTRL_CHANGE < cp1.dist(cp0);
    }
    if (addCP) {
      spline.setCPoint(this.nControl - 1, cp1);
      return true;
    }
    return false;
  },

  addRibbonStretch: function(spline1, spline2, r, g, b, a) {
    if (!this.Sid1Point0) this.Sid1Point0 = this.p.createVector(0, 0);
    if (!this.Sid1Point1) this.Sid1Point1 = this.p.createVector(0, 0);
    if (!this.Sid2Point0) this.Sid2Point0 = this.p.createVector(0, 0);
    if (!this.Sid2Point1) this.Sid2Point1 = this.p.createVector(0, 0);

    var ti;
    var t;
  
    // The initial geometry is generated.
    spline1.feval(0, this.Sid1Point1);
    spline2.feval(0, this.Sid2Point1);
  
    for (ti = 1; ti <= 10; ti++) {
      if (ti % this.ribbonDetail == 0) {
        t = 0.1 * ti;
  
        // The geometry of the previous iteration is saved.
        this.Sid1Point0.set(this.Sid1Point1);
        this.Sid2Point0.set(this.Sid2Point1);
  
        // The new geometry is generated.
        spline1.feval(t, this.Sid1Point1);
        spline2.feval(t, this.Sid2Point1);
  
        var quad = new StrokeQuad(this.p.millis());
        quad.setVertex(0, this.Sid1Point0.x, this.Sid1Point0.y, 0, this.uTexCoord, r, g, b, a);
        quad.setVertex(1, this.Sid2Point0.x, this.Sid2Point0.y, 1, this.uTexCoord, r, g, b, a);
        this.updateTexCoordU();
        quad.setVertex(2, this.Sid2Point1.x, this.Sid2Point1.y, 1, this.uTexCoord, r, g, b, a);
        quad.setVertex(3, this.Sid1Point1.x, this.Sid1Point1.y, 0, this.uTexCoord, r, g, b, a);
        this.updateTexCoordU();
        this.addQuad(quad);
      }
    }
  },

  updateTexCoordU: function() {
    this.uTexCoord += TEXCOORDU_INC;
    if (1 < this.uTexCoord) {
      this.uTexCoord = 0;
    }
  },

  addQuad: function(quad) {
    this.quads.push(quad);
  },

  pintar: function(toques, tinta, escala) {
    if (this.quadCount.length < toques.length) {
      for (let i = this.quadCount.length; i < toques.length; i++) {
        this.addPointToRibbon(toques[i].x, toques[i].y, tinta, escala, toques[i].primero);
        this.quadCount.push(this.quads.length);
      }
    }

    if (0 < this.quadCount.length) {
      let p = this.p;
      let alphaScale = p.alpha(tinta) / 255;
      p.beginShape(p.QUADS);
      p.noStroke();
      p.fill(tinta);
      for (let i = 0; i < this.quadCount[toques.length - 1]; i++) {
        let quad = this.quads[i];
        quad.display(p, alphaScale);
      }        
      p.endShape();
    }
  }
}

function StrokeQuad(t) {
  this.t = t;
  this.x = [0, 0, 0, 0];
  this.y = [0, 0, 0, 0];
  this.u = [0, 0, 0, 0];
  this.v = [0, 0, 0, 0];
  this.r = [0, 0, 0, 0];
  this.g = [0, 0, 0, 0];
  this.b = [0, 0, 0, 0];
  this.a = [0, 0, 0, 0];
  this.a0 = [0, 0, 0, 0];
  this.visible = true;
}
  
StrokeQuad.prototype.setVertex = function(i, x, y, u, v, r, g, b, a) {
  this.x[i] = x;
  this.y[i] = y;
  
  this.u[i] = u;
  this.v[i] = v;
  
  this.r[i] = r;
  this.g[i] = g;
  this.b[i] = b;
  this.a[i] = a;
  
  this.a0[i] = a;
}
  
StrokeQuad.prototype.restoreAlpha = function () {
  for (var i = 0; i < 4; i++) {
    this.a[i] = this.a0[i];
  }
}
  
StrokeQuad.prototype.update = function(ff) {
  this.visible = false;
  for (var i = 0; i < 4; i++) {
    this.a[i] *= ff;
    if (INVISIBLE_ALPHA < this.a[i]) {
      this.visible = true;
    } else {
      this.a[i] = 0;
    }
  }
}
  
  /*
  // separate quads 
  StrokeQuad.prototype.draw = function(ascale) {
    if (this.visible) {
      beginShape(QUADS);
      for (var i = 0; i < 4; i++) {
        noStroke();
        fill(this.r[i], this.g[i], this.b[i], this.a[i] * ascale);
        vertex(this.x[i], this.y[i]);
      }
      endShape(CLOSE);
    }
  }
  */
  
// quad strip
StrokeQuad.prototype.display = function(p, alphaScale) {
  if (this.visible) {
    for (let i = 0; i < 4; i++) {
      p.fill(this.r[i], this.g[i], this.b[i], this.a[i] * alphaScale);
      p.vertex(this.x[i], this.y[i]);
    }
  }
}

var MAX_BEZIER_ORDER = 10; // Maximum curve order.

var BSplineMatrix = [
  [-1.0/6.0,  1.0/2.0, -1.0/2.0, 1.0/6.0],
  [ 1.0/2.0,     -1.0,  1.0/2.0,     0.0],
  [-1.0/2.0,      0.0,  1.0/2.0,     0.0],
  [ 1.0/6.0,  2.0/3.0,  1.0/6.0,     0.0]
];

// The element(i, n) of this array contains the binomial coefficient
// C(i, n) = n!/(i!(n-i)!)
var BinomialCoefTable = [
  [1, 1, 1, 1,  1,  1,  1,  1,   1,   1],
  [1, 2, 3, 4,  5,  6,  7,  8,   9,  10],
  [0, 1, 3, 6, 10, 15, 21, 28,  36,  45],
  [0, 0, 1, 4, 10, 20, 35, 56,  84, 120],
  [0, 0, 0, 1,  5, 15, 35, 70, 126, 210],
  [0, 0, 0, 0,  1,  6, 21, 56, 126, 252],
  [0, 0, 0, 0,  0,  1,  7, 28,  84, 210],
  [0, 0, 0, 0,  0,  0,  1,  8,  36, 120],
  [0, 0, 0, 0,  0,  0,  0,  1,   9,  45],
  [0, 0, 0, 0,  0,  0,  0,  0,   1,  10],
  [0, 0, 0, 0,  0,  0,  0,  0,   0,   1]
];

// The element of this(i, j) of this table contains(i/10)^(3-j).
var TVectorTable = [  
//   t^3,  t^2, t^1, t^0
  [    0,    0,   0,   1], // t = 0.0
  [0.001, 0.01, 0.1,   1], // t = 0.1
  [0.008, 0.04, 0.2,   1], // t = 0.2
  [0.027, 0.09, 0.3,   1], // t = 0.3
  [0.064, 0.16, 0.4,   1], // t = 0.4
  [0.125, 0.25, 0.5,   1], // t = 0.5
  [0.216, 0.36, 0.6,   1], // t = 0.6
  [0.343, 0.49, 0.7,   1], // t = 0.7
  [0.512, 0.64, 0.8,   1], // u = 0.8
  [0.729, 0.81, 0.9,   1], // t = 0.9
  [    1,    1,   1,   1]  // t = 1.0
];

// The element of this(i, j) of this table contains(3-j)*(i/10)^(2-j) if
// j < 3, 0 otherwise.
var DTVectorTable = [
// 3t^2,  2t^1, t^0
  [   0,     0,   1, 0], // t = 0.0
  [0.03,   0.2,   1, 0], // t = 0.1
  [0.12,   0.4,   1, 0], // t = 0.2
  [0.27,   0.6,   1, 0], // t = 0.3
  [0.48,   0.8,   1, 0], // t = 0.4
  [0.75,   1.0,   1, 0], // t = 0.5
  [1.08,   1.2,   1, 0], // t = 0.6
  [1.47,   1.4,   1, 0], // t = 0.7
  [1.92,   1.6,   1, 0], // t = 0.8
  [2.43,   1.8,   1, 0], // t = 0.9
  [   3,     2,   1, 0]  // t = 1.0
];

function Spline() {
}

// The factorial of n.
Spline.prototype.factorial = function(n) {
  return n <= 0 ? 1 : n * factorial(n - 1); 
}

// Gives n!/(i!(n-i)!).
Spline.prototype.binomialCoef = function(i, n) {
  if ((i <= MAX_BEZIER_ORDER) && (n <= MAX_BEZIER_ORDER)) return BinomialCoefTable[i][n - 1];
  else return int(factorial(n) / (factorial(i) * factorial(n - i)));
}

// Evaluates the Berstein polinomial(i, n) at u.
Spline.prototype.bersteinPol = function(i, n, u) {
  return binomialCoef(i, n) * Math.pow(u, i) * Math.pow(1 - u, n - i);
}

  // The derivative of the Berstein polinomial.
Spline.prototype.dbersteinPol = function(i, n, u) {
  var s1, s2; 
  if (i == 0) s1 = 0; 
  else s1 = i * Math.pow(u, i-1) * Math.pow(1 - u, n - i);
  if (n == i) s2 = 0; 
  else s2 = -(n - i) * Math.pow(u, i) * Math.pow(1 - u, n - i - 1);
  return binomialCoef(i, n) *(s1 + s2);
}

// function BSpline() {
//   Spline.call(this);
//   this.initParameters(true); 
// }

function BSpline(t) {
  Spline.call(this);
  this.initParameters(t); 
}

// Inherit Spline
BSpline.prototype = new Spline();
// Correct the constructor pointer because it points to Spline
BSpline.prototype.constructor = BSpline;

  // Sets lookup table use.
BSpline.prototype.initParameters = function(t) { 
  // Control points.
  this.bsplineCPoints = [[0.0, 0.0, 0.0],
                         [0.0, 0.0, 0.0],
                         [0.0, 0.0, 0.0],
                         [0.0, 0.0, 0.0]];

  // Parameters.
  this.lookup = t;

  // Auxiliary arrays used in the calculations.
  this.M3 = [[0.0, 0.0, 0.0],
             [0.0, 0.0, 0.0],
             [0.0, 0.0, 0.0],
             [0.0, 0.0, 0.0]];

  this.TVector = [0.0, 0.0, 0.0, 0.0]; 
  this.DTVector = [0.0, 0.0, 0.0, 0.0]; 

  // Point and tangent vectors.
  this.pt = [0.0, 0.0, 0.0]; 
  this.tg = [0.0, 0.0, 0.0];
}

// Sets n-th control point.
BSpline.prototype.setCPoint = function(n, P) {
  this.bsplineCPoints[n][0] = P.x;
  this.bsplineCPoints[n][1] = P.y;
  this.bsplineCPoints[n][2] = P.z;        
  this.updateMatrix3();
}

// Gets n-th control point.
BSpline.prototype.getCPoint = function(n, P) {
  P.x = this.bsplineCPoints[n][0];
  P.y = this.bsplineCPoints[n][1];
  P.z = this.bsplineCPoints[n][2];
}

// Replaces the current B-spline control points(0, 1, 2) with(1, 2, 3). This
// is used when a new spline is to be joined to the recently drawn.
BSpline.prototype.shiftBSplineCPoints = function() {
  for (var i = 0; i < 3; i++) {
    this.bsplineCPoints[0][i] = this.bsplineCPoints[1][i];
    this.bsplineCPoints[1][i] = this.bsplineCPoints[2][i];
    this.bsplineCPoints[2][i] = this.bsplineCPoints[3][i];
  }
  this.updateMatrix3();
}

BSpline.prototype.copyCPoints = function(i0, i1) {
  for (var i = 0; i < 3; i++) {
    this.bsplineCPoints[i1][i] = this.bsplineCPoints[i0][i];
  }
}

// Updates the temporal matrix used in order 3 calculations.
BSpline.prototype.updateMatrix3 = function() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
      var sum = 0;
      for (var k = 0; k < 4; k++) sum += BSplineMatrix[i][k] * this.bsplineCPoints[k][j];
      this.M3[i][j] = sum;
    }
  }
}    

BSpline.prototype.feval = function(t, p) { 
  this.evalPoint(t); 
  p.set(this.pt); 
}

BSpline.prototype.deval = function(t, d) { 
  this.evalTangent(t); 
  d.set(tg); 
}

BSpline.prototype.fevalX = function(t) { 
  this.evalPoint(t); 
  return this.pt[0]; 
}

BSpline.prototype.fevalY = function(t) { 
  this.evalPoint(t); 
  return this.pt[1]; 
}

BSpline.prototype.fevalZ = function(t) { 
  evalPoint(t); 
  return this.pt[2]; 
}

BSpline.prototype.devalX = function(t) { 
  this.evalTangent(t); 
  return tg[0]; 
}

BSpline.prototype.devalY = function(t) { 
  this.evalTangent(t); 
  return tg[1]; 
}

BSpline.prototype.devalZ = function(t) { 
  this.evalTangent(t); 
  return tg[2]; 
}

// Point evaluation.
BSpline.prototype.evalPoint = function(t) {
  if (this.lookup) {
    this.bsplinePointI(Math.floor(10 * t));
  } else {
    this.bsplinePoint(t);
  }
}    

  // Tangent evaluation.
BSpline.prototype.evalTangent = function(t) {
  if (this.lookup) {
    this.bsplineTangentI(Math.floor(10 * t));
  } else {
    this.bsplineTangent(t);
  }
}

// Calculates the point on the cubic spline corresponding to the parameter value t in [0, 1].
BSpline.prototype.bsplinePoint = function(t) {
  // Q(u) = UVector * BSplineMatrix * BSplineCPoints
  for (var i = 0; i < 4; i++) {
    this.TVector[i] = pow(t, 3 - i);
  }

  for (var j = 0; j < 3; j++) {
    var s = 0;
    for (var k = 0; k < 4; k++) {
      s += this.TVector[k] * this.M3[k][j];
    }
    this.pt[j] = s;
  }
}

// Calculates the tangent vector of the spline at t.
BSpline.prototype.bsplineTangent = function(t) {
  // Q(u) = DTVector * BSplineMatrix * BSplineCPoints
  for (var i = 0; i < 4; i++) {
    if (i < 3) {
      this.DTVector[i] = (3 - i) * Math.pow(t, 2 - i);
    } else {
      this.DTVector[i] = 0;
    }
  }

  for (var j = 0; j < 3; j++) {
    var s = 0;
    for (var k = 0; k < 4; k++) {
      s += this.DTVector[k] * this.M3[k][j];
    }
    this.tg[j] = s;
  }
}

// Gives the point on the cubic spline corresponding to t/10(using the lookup table).
BSpline.prototype.bsplinePointI = function(t) {
  // Q(u) = TVectorTable[u] * BSplineMatrix * BSplineCPoints
  for (var j = 0; j < 3; j++) {
    var s = 0;
    for (var k = 0; k < 4; k++) {
      s += TVectorTable[t][k] * this.M3[k][j];
    }
    this.pt[j] = s;
  }
}

// Calulates the tangent vector of the spline at t/10.
BSpline.prototype.bsplineTangentI = function(t) {
  // Q(u) = DTVectorTable[u] * BSplineMatrix * BSplineCPoints
  for (var j = 0; j < 3; j++) {
    var s = 0;
    for (var k = 0; k < 4; k++) {
      s += DTVectorTable[t][k] * this.M3[k][j];
    }
    this.tg[j] = s;
  }
}