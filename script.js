var textarea = document.getElementById("code");
var canvas = document.getElementById("render-canvas");
var ctx = canvas.getContext("2d");
var aspect = canvas.width / canvas.height;

//valores da projeção
var near = 0.1;
var far = 1000.;
var angle = 45;
var stop = false;
var objects = [];

point_intersection = null;

function updateScene() {
    restart();
    eval(textarea.value);
}

function restart() {
    objects = [];
}

function addObject(obj) {
    objects.push(obj);
}

//define o tamanho da janela
function sizeWindow(w, h) {
    canvas.height = h;
    canvas.width = w;
    aspect = canvas.width / canvas.height;
}

//TODO:coloque uma função para especificar a projeção


textarea.addEventListener("input", updateScene());

function renderCanvas() {
    stop = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    hl = 2 * near * Math.tan(angle * Math.PI / 360.);
    wl = hl * aspect;

    deltaY = hl / canvas.height;
    deltaX = wl / canvas.width;

    //TODO:coloque uma função para especificar a câmera via interface
    var camera = new Camera();
    camera.eye = new Vec3(0, 0, 15.);
    camera.at = new Vec3(0, 0, 0);
    camera.up = new Vec3(0, 1., 0);

    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            var xc = -wl / 2 + deltaX / 2 + i * deltaX;
            var yc = -(-hl / 2 + deltaY / 2 + j * deltaY);
            var point = new Vec3(xc, yc, -near);

            var o = new Vec3(0, 0, 0); //origem de câmera
            var d = new Vec3(point.x, point.y, point.z);
            ray = new Ray(o, d);
            var intercept = false;
            for (var k = 0; k < objects.length; k++) {
                var shape = objects[k];
                //raio transformado em coordenadas do mundo
                var ray_w = new Ray(multVec4(camera.lookAt(), ray.o), multVec4(camera.lookAt(), ray.d));
                var result = shape.testIntersectionRay(ray_w);
                if (result[0]) {
                    intercept = true;
                    var position = result[1];
                    var normal = result[2];
                    var viewer = camera.eye;
                    var colorF = new Vec3(228 / 255., 44 / 255., 100 / 255.);
                    ctx.fillStyle = "rgb(" + Math.min(colorF.x, 1) * 255 + "," + Math.min(colorF.y, 1) * 255 + "," + Math.min(colorF.z, 1) * 255 + ")";
                    ctx.fillRect(i, j, 1, 1);
                }
            }
            if (!intercept) {
                ctx.fillStyle = "rgb(" + 0 + "," + 0 + "," + 0 + ")";
                ctx.fillRect(i, j, 1, 1);
            }

        }
    }
    stop = false;

}