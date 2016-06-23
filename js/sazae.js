/// <reference path="./typings/index.d.ts" />
// 描画に必要なデータを格納しておく
function treeNode(id, parent, marrige, children, depth, x, y, z, color, detail) {
    this.id = id;
    this.parent = parent;
    this.marrige = marrige;
    this.children = children;
    this.depth = depth;
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    this.detail = detail;
}
// threejsの初期化
var drawing = (function () {
    // コンストラクタ
    function drawing() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.init();
        this.initCamera();
        this.initLight();
    }
    // threejsの初期化
    drawing.prototype.init = function () {
        this.canvasFrame = document.getElementById('canvas_frame');
        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 1.0);
        this.canvasFrame.appendChild(this.renderer.domElement);
    };
    // カメラの初期化
    drawing.prototype.initCamera = function () {
        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 5000);
        this.camera.position.set(0, 0, 1000);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.trackball = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        this.trackball.noRotate = false;
        this.trackball.rotateSpeed = 3.0;
        this.trackball.noZoom = false;
        this.trackball.zoomSpeed = 0.3;
        this.trackball.noPan = false;
        this.trackball.panSpeed = 0.1;
        this.trackball.staticMoving = false;
        this.trackball.dynamicDampingFactor = 0.2;
        this.trackball.minDistance = 500;
        this.trackball.maxDistance = 4000;
        this.trackball.keys = [65, 83, 68];
    };
    drawing.prototype.cameraReset = function () {
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.up = new THREE.Vector3(0, 1, 0);
        // this.camera.position = new THREE.Vector3(0, 0, 0);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 1000;
        this.camera.rotateX(0);
        this.camera.rotateY(0);
        this.camera.rotateZ(0);
        this.camera.matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1000, 0, 0, 0, 1);
    };
    // 光源の初期化
    drawing.prototype.initLight = function () {
        this.light = new THREE.AmbientLight(0x555555);
        this.dlight = new THREE.DirectionalLight(0xffffff);
        this.dlight.position.set(-1, 1, 1).normalize();
        this.scene.add(this.light);
        this.scene.add(this.dlight);
    };
    // リサイズの設定
    drawing.prototype.onWindowResize = function () {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    };
    // クリック判定
    drawing.prototype.onmousemove = function (e) {
        var sce = this.scene;
        var rend = this.renderer;
        var cam = this.camera;
        var h = this.height;
        var w = this.width;
        this.renderer.domElement.addEventListener('click', function (e) {
            var mouseX = e.pageX - rend.domElement.offsetLeft;
            var mouseY = e.pageY - rend.domElement.offsetTop;
            // var mouseX = e.pageX;
            // var mouseY = e.pageY;
            mouseX = (mouseX / w) * 2 - 1;
            mouseY = -(mouseY / h) * 2 + 1;
            var pos = new THREE.Vector3(mouseX, mouseY, 1);
            pos.unproject(cam);
            var ray = new THREE.Raycaster(cam.position, pos.sub(cam.position).normalize());
            var obj = ray.intersectObjects(sce.children);
            // console.log(pos);
            // console.log(obj);
            // console.log(ray);
            if (obj.length > 0) {
                console.log(obj[0].object.name);
            }
        });
    };
    // 四角の描画関数
    drawing.prototype.squareMesh = function (x, y, z, size, color) {
        var geometry = new THREE.PlaneGeometry(size, size);
        var material = new THREE.MeshLambertMaterial({ color: color });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        this.scene.add(mesh);
    };
    // 球体の描画関数
    drawing.prototype.sphereMesh = function (x, y, z, size, color, i) {
        var geometry = new THREE.SphereGeometry(size, 20, 20);
        var material = new THREE.MeshLambertMaterial({ color: color });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.name = "sphere" + i;
        this.scene.add(mesh);
    };
    // 線の描画関数
    drawing.prototype.lineMesh = function (x1, y1, z1, x2, y2, z2, color) {
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({
            color: color
        });
        geometry.vertices.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
        var mesh = new THREE.Line(geometry, material);
        this.scene.add(mesh);
    };
    // 婚姻関係用の二重横線
    drawing.prototype.doubleLineMesh = function (x1, y1, z1, x2, y2, z2, color) {
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({
            color: color
        });
        geometry.vertices.push(new THREE.Vector3(x1, y1 + 3, z1), new THREE.Vector3(x2, y2 + 3, z2));
        var mesh = new THREE.Line(geometry, material);
        this.scene.add(mesh);
        var geometry2 = new THREE.Geometry();
        var material2 = new THREE.LineBasicMaterial({
            color: color
        });
        geometry2.vertices.push(new THREE.Vector3(x1, y1 - 3, z1), new THREE.Vector3(x2, y2 - 3, z2));
        var mesh2 = new THREE.Line(geometry2, material2);
        this.scene.add(mesh2);
    };
    drawing.prototype.helper = function (ln) {
        var axis = new THREE.AxisHelper(ln);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
    };
    // 文章の描画関数
    drawing.prototype.textMesh = function (x, y, z, text, color) {
        var imageCanvas = document.createElement('canvas');
        var imageContext = imageCanvas.getContext('2d');
        imageCanvas.width = 128;
        imageCanvas.height = 128;
        var txt = text;
        imageContext.font = "25px Arial";
        imageContext.fillStyle = color;
        imageContext.fillText(txt, 10, 50);
        var texture = new THREE.Texture(imageCanvas);
        texture.needsUpdate = true;
        var material = new THREE.SpriteMaterial({ map: texture, color: color });
        var sprite = new THREE.Sprite(material);
        sprite.scale.set(100, 100, 100);
        sprite.position.set(x, y, z);
        sprite.rotation.setFromRotationMatrix(this.camera.matrix);
        this.scene.add(sprite);
    };
    // 全体の描画
    drawing.prototype.render = function () {
        this.clock = new THREE.Clock();
        requestAnimationFrame(this.render.bind(this));
        // var delta = this.clock.getDelta();
        this.trackball.update();
        this.renderer.render(this.scene, this.camera);
    };
    return drawing;
})();
// 描画に最低限の情報を読み込む
var url = "data/tree.json";
var data = [];
var nodeDepth = [];
$.getJSON(url, function (tree) {
    for (var i = 0; i < tree.list.length; i++) {
        data[i] = new treeNode(tree.list[i].id, tree.list[i].parent, tree.list[i].marrige, tree.list[i].children, 0, 0.0, 0.0, 0.0, 0xffffff, null);
    }
    // インスタンス生成、初期化
    var d = new drawing();
    var l = [];
    for (var i = 0; i < 8; i++) {
        var x = 100 * Math.cos(i * 2 * Math.PI / 8);
        var z = 100 * Math.sin(i * 2 * Math.PI / 8);
        l.push([x, z]);
    }
    // d.helper(500);
    d.sphereMesh(0, 0, 0, 10, 0xffff00, 55);
    // シーンにオブジェクトを追加
    for (i = 0; i < l.length; i++) {
        d.sphereMesh(l[i][0], 0, l[i][1], 10, 0xff0000, i);
    }
    for (i = 0; i < d.scene.children.length; i++) {
        console.log(d.scene.children[i].id, d.scene.children[i].name);
    }
    window.onload = function (e) {
        d.onmousemove(e);
    };
    $("button").click(function () {
        d.cameraReset();
    });
    // 描画
    d.render();
});
