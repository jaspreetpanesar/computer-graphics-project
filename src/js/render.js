// render.js
// stores main renderer, scene, resize function and update loop

var scene = new THREE.Scene();
var ratio = window.innerWidth/window.innerHeight;

// setup renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// add renderer to html webpage
document.getElementById("render").appendChild(renderer.domElement);

// default camera (perspective)
var camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 1);


// controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// updates camera and scene aspect and size to match window size
// runs when the window is resized
window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
});

// runs function every frame to render scene changes on screen
var updateloop = function() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(updateloop);
}

// run manually once to start rendering process
requestAnimationFrame(updateloop);
