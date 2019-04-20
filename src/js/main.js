// main.js
// stores main renderer, scene, resize function and update loop

var scene, ratio, renderer, camera, controls;
var elements = [];

var running = false;
var debug = false;

var time_delta = 1;

// runs function every frame to render scene changes on screen
var updateloop = function() {

    if (running) {

        /* 
           each time this is run, loop through elements array
           and call .update() function for each element.
        */
        for (var i=0; i<elements.length; i++) {
            elements[i].update();
        }

    }

    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(updateloop);
}

/*
   load scene, all elements and controls
*/
function load() {
    scene = new THREE.Scene();
    ratio = window.innerWidth/window.innerHeight;

    // setup renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // add renderer to html webpage
    document.getElementById("render").appendChild(renderer.domElement);

    // default camera (perspective)
    camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    camera.position.set(0, 0, 200);
    // camera.lookAt(0, 0, 1);

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

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

    // add ambient light
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    // var light = new THREE.AmbientLight(new THREE.Color(1, 1, 1)); // soft white light
    scene.add( light );

    // create elements
    elements.push(new Sun('sun', 20, position=new THREE.Vector3(0, 0, 0)));
    elements.push(new Planet(
                    name='earth', 
                    radius=5, 
                    position=new THREE.Vector3(90, 0, 0),
                    // position=new THREE.Vector3(0, 0, 0),
                    rotation=new THREE.Vector3(),
                    rot_speed=new THREE.Vector3(0, 0.1, 0),
                    orbit_speed = 0,
                    parent_obj=elements[0],
                    has_ocean=true,
                ));

    // add elements to scene
    for (var i=0; i<elements.length; i++)
        elements[i].show();

    // start and stop elements updating using spacebar
    document.addEventListener('keydown', function(event) {
        // console.log(event.keyCode);

        switch (event.keyCode) {
            case 32:
                if (running)
                    stop();
                else
                    run();
                break;

            case 68:
                toggle_debug();
                break;
        }
    }, false);


}


/*
   start renderer and update process
*/
function start() {
    // run manually once to start automatic rendering process
    running = true;
    requestAnimationFrame(updateloop);

}

function run() {
    running = true;
}

function stop() {
    running = false;
}

function toggle_debug() {
    if (debug)
        debug = false;
    else
        debug = true;

    for (var i=0; i<elements.length; i++)
        elements[i].wireframe(debug);

}

