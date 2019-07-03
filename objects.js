function Ray(o, d) {
    this.o = o; //origem
    this.d = d; //direção do raio
}

Ray.prototype.show = function() {
    console.log("O" + "(" + this.o.x + "," + this.o.y + "," + this.o.z + "," + this.o.w + ")" + ", d = " + "(" + this.d.x + "," + this.d.y + "," + this.d.z + "," + this.d.w + ")")
}

Ray.prototype.get = function(t) {
    return new Vec3().sum(this.o, this.d.prod(this.d, t));
}


function Vec3() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
}

function Vec3(x, y, z, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vec3.prototype.set = function(v) {
    this.x = v;
    this.y = v;
    this.z = v;
}

Vec3.prototype.set = function(x, y, z, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}
Vec3.prototype.sum = function(p1, p2) {
    return new Vec3(p1.x + p2.x, p1.y + p2.y, p1.z + p2.z);
}
Vec3.prototype.minus = function(p1, p2) {
    return new Vec3(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
}
Vec3.prototype.dot = function(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
}
Vec3.prototype.cross = function(p1, p2) {
    return new Vec3(p1.y * p2.z - p1.z * p2.y, -(p1.x * p2.z - p1.z * p2.x), p1.x * p2.y - p1.y * p2.x);
}
Vec3.prototype.module = function(p) {
    return Math.sqrt(this.dot(p, p));
}
Vec3.prototype.div = function(p, k) {
    return new Vec3(p.x / k, p.y / k, p.z / k);
}
Vec3.prototype.prod = function(p, k) {
    return new Vec3(p.x * k, p.y * k, p.z * k);
}
Vec3.prototype.compond = function(p, p0) {
    return new Vec3(p.x * p0.x, p.y * p0.y, p.z * p0.z);
}
Vec3.prototype.unitary = function(p) {
    var m = this.module(p);
    return new Vec3(p.x / m, p.y / m, p.z / m);
}

Vec3.prototype.show = function() {
    console.log("x: " + this.x + ", y: " + this.y + ", z: " + this.z);
}

//ids shape
var sphere = 1;

function Camera(eye, at, up) {
    this.eye = eye;
    this.at = at;
    this.up = up;
}

//TODO: faça função que mapeia
//de mundo para camera e retorne uma matriz 4x4
function lookAtM(eye, at, up) {

}

//TODO: faça função que mapeia
//de câmera para mundo e retorne uma matriz 4x4
function lookAtInverseM(eye, at, up) {

}

//de mundo para camera
Camera.prototype.lookAt = function() {
    return lookAtM(this.eye, this.at, this.up);
}

//de câmera para mundo
Camera.prototype.lookAtInverse = function() {
    return lookAtInverseM(this.eye, this.at, this.up);
}

function Shape() {
    this.geometry = sphere;
    this.name = "";
    this.translate = new Vec3(0, 0, 0);
    this.scale = new Vec3(0, 0, 0);
    this.rotate = new Vec3(0, 0, 0);
}

function Shape(name) {
    this.geometry = sphere;
    this.name = name;
    this.translate = new Vec3(0, 0, 0);
    this.scale = new Vec3(0, 0, 0);
    this.rotate = new Vec3(0, 0, 0);
    this.shine = 0.0;
}

Shape.prototype.setScale = function(x = 0, y = 0, z = 0) {
    this.scale = new Vec3(x, y, z);
}


Shape.prototype.setTranslate = function(x = 0, y = 0, z = 0) {
    this.translate = new Vec3(x, y, z);
}

Shape.prototype.setRotateX = function(angle) {
    this.rotate.x = angle;
}

Shape.prototype.setRotateY = function(angle) {
    this.rotate.y = angle;
}

Shape.prototype.setRotateZ = function(angle) {
    this.rotate.z = angle;
}

Shape.prototype.transformMatrix = function() {
    var T = translateMatrix(this.translate.x, this.translate.y, this.translate.z); //TODO: modificar para receber a matriz de escala
    var R = multMatrix(rotateMatrixX(this.rotate.x), multMatrix(rotateMatrixY(this.rotate.y), rotateMatrixZ(this.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var S = scaleMatrix(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(T, multMatrix(R, S));
}

Shape.prototype.transformMatrixVec = function() {
    var R = multMatrix(rotateMatrixX(this.rotate.x), multMatrix(rotateMatrixY(this.rotate.y), rotateMatrixZ(this.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var S = scaleMatrix(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(R, S);
}

Shape.prototype.transformMatrixInverse = function() {
    var Ti = translateMatrixI(this.translate.x, this.translate.y, this.translate.z); //TODO: modificar para receber a matriz de escala
    var Ri = multMatrix(rotateMatrixXI(this.rotate.z), multMatrix(rotateMatrixYI(this.rotate.y), rotateMatrixZI(this.rotate.x))); //TODO: modificar para receber a matriz de rotação
    var Si = scaleMatrixI(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(Si, multMatrix(Ri, Ti));
}

Shape.prototype.transformMatrixVecInverse = function() {
    var Ti = translateMatrixI(this.translate.x, this.translate.y, this.translate.z); //TODO: modificar para receber a matriz de escala
    var Ri = multMatrix(rotateMatrixXI(this.rotate.z), multMatrix(rotateMatrixYI(this.rotate.y), rotateMatrixZI(this.rotate.x))); //TODO: modificar para receber a matriz de rotação
    var Si = scaleMatrixI(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(Si, Ri);
}

Shape.prototype.testIntersectionRay = function(ray) {
    //salvando raio em coordenadas do mundo para calcular o parâmetro t
    var ray_w = ray;
    var M_i = this.transformMatrixInverse();
    var M_i_v = this.transformMatrixVecInverse();
    var Vec = new Vec3();
    //transformando raio para coordenadas locais do objeto
    Vec = new Vec3();
    ray.d = Vec.minus(ray.d, ray.o);
    ray.o = multVec4(M_i, ray.o);
    ray.d = multVec4(M_i_v, ray.d);

    if (this.geometry == sphere) { //testar interseção com a esfera
        //interseção com esfera na origem e raio unitário
        var a = Vec.dot(ray.d, ray.d);
        var b = 2 * (Vec.dot(ray.d, ray.o));
        var c = Vec.dot(ray.o, ray.o) - 1;
        var delta = b * b - 4 * a * c;
        if (delta >= 0) {
            var t1 = (-b + Math.sqrt(delta)) / (2 * a);
            var t2 = (-b - Math.sqrt(delta)) / (2 * a);
            t = Math.min(t1, t2);

            var point = ray.get(t);
            var normal = point;
            var M = this.transformMatrix();
            point = multVec4(M, point);
            M = this.transformMatrixVec();
            normal = multVec4(M, normal);
            normal = Vec.unitary(normal);
            var t_ = Vec.module(Vec.minus(point, ray_w.o));
            return [true, point, normal, t_];
        }

    }
    return [false, null];
}