// main.js
// stores main renderer, scene, resize function and update loop

var scene, ratio, renderer, camera, controls;
var elements = [];
var running = false;

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
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 1);

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


    // create elements
    // elements.push(new Planet('earth', 5, rot_speed=0.1));
    elements.push(new Planet('earth2', 5, rot_speed=0.8));



    // add elements to scene
    for (var i=0; i<elements.length; i++)
        scene.add(elements[i].model);

    // start and stop elements updating using spacebar
    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 32:
                if (running)
                    stop();
                else
                    run();
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

