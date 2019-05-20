// main.js
// stores main renderer, scene, resize function and update loop

var scene, ratio, renderer, camera, controls, ambientlight, gui;

var elements = [];  // all elements which require updates
var planets = [];   // planets only

var running = false;
var debug = false;

var time_delta = 1;
var time_change = 0.1;
var camZoom = 1;
var camera_child_index = 0;

var sun, starfield;


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

    camera.update();
    renderer.render(scene, camera.camera);
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // add renderer to html webpage
    document.getElementById("render").appendChild(renderer.domElement);

    // default camera (perspective)
    camera = new CustomCamera();

    // controls
    controls = new THREE.OrbitControls(camera.camera, renderer.domElement);
    controls.maxDistance = 1500;

    // updates camera and scene aspect and size to match window size
    // runs when the window is resized
    window.addEventListener('resize', function() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        renderer.setSize(width, height);
        camera.camera.aspect = width/height;
        camera.camera.updateProjectionMatrix();

        renderer.render(scene, camera.camera);
    });

    // add ambient light
    ambientlight = new THREE.AmbientLight(new THREE.Color(0.12, 0.12, 0.12));
    // ambientlight = new THREE.AmbientLight( 0x404040 ); // soft white light
    // ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1)); // soft white light
    scene.add(ambientlight);

    starfield = new Starfield();

    // create elements
    sun = new Sun('sun', 20, position=new THREE.Vector3(0, 0, 0));

    elements.push(sun);
    create_system();

    // elements.push(new Planet(
    //                 name='earth',
    //                 radius=5,
    //                 position=new THREE.Vector3(400, 0, 0),
    //                 // position=new THREE.Vector3(0, 0, 0),
    //                 rotation=new THREE.Vector3(),
    //                 rot_speed=new THREE.Vector3(0, 0.101, 0),
    //                 orbit_speed = 0.001,
    //                 parent_obj=elements[0], // sun
    //                 has_ocean=true,
    //             ));

    // elements.push(new Planet(
    //                 name='moon',
    //                 radius=1,
    //                 // position=new THREE.Vector3(-40, 0, 50),
    //                 position=new THREE.Vector3(10,0,0),
    //                 rotation=new THREE.Vector3(),
    //                 rot_speed=new THREE.Vector3(0, 1.2, 0),
    //                 orbit_speed=0.01,
    //                 parent_obj=elements[1], // earth
    //                 has_ocean=false));

    // elements.push(new Planet(
    //                 name='mars',
    //                 radius=3,
    //                 position=new THREE.Vector3(250, 0, 10),
    //                 rotation=new THREE.Vector3(0,0,0),
    //                 rot_speed=new THREE.Vector3(0, 0.01, 0),
    //                 orbit_speed=0.003,
    //                 parent_obj=elements[0],
    //                 has_ocean=false
    //             ));

    // create an array with planets only
    // planets = [elements[1], elements[3]];
    camera.change_child( planets[camera_child_index] );


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

            // speed up time
            case 187:
                increase_time();
                break;

            // slow down time
            case 189:
                decrease_time();
                break;

            // reset time
            case 48:
                reset_time();
                break;

            // change camera child (left)
            case 69:
                change_camera_focus(0);
                break;

            // change camera child (right)
            case 81:
                change_camera_focus(1);
                break;

            case 67:
                camera.toggle_state();
                break;

           case 87:
                camera.ZoomAdder();
              //  console.log("w pressed")
                break;

           case 83:
                camera.ZoomSubtractor();
              //  console.log("s pressed")
           break;


        }
    }, false);


    // GUI
    gui = new dat.GUI({
        height: 5 * 32 - 1
    });

    for (var i=0; i<planets.length; i++){
        gui.add(planets[i], 'name');
        gui.add(planets[i], 'radius');
        gui.add(planets[i], 'orbit_speed');
    }

}

/*
   Solar System Functions
*/


function clear_system() {
    elements = [];
    planets = [];
}


function create_system() {

    // clear_system();

    var system_size = random_number(3, 9);
    var moon_size;

    var planet_count = 1;
    var moon_count = 0;

    // elements.push(sun);

    for (var i=0; i<system_size; i++) {

        var radius = random_number(3, 6);

        var p = new Planet(
                    name="Planet " + planet_count,
                    radius = radius,
                    position = new THREE.Vector3((random_number(80, 120)*planet_count), 0, 0),
                    rotation = new THREE.Vector3(),
                    rot_speed = new THREE.Vector3(0, random_float(0.0001, 0.01), 0),
                    orbit_speed = random_float(-0.01, 0.01),
                    parent_obj = sun,
                    has_ocean = random_boolean(),
                );

        elements.push(p);
        planets.push(p);

        // create moons
        // moon_size = random_number(0, 3);
        moon_size = 1;
        moon_count = 1; 

        for (var j=0; j<moon_size; j++) {

            var m = new Planet(
                    name="Moon " + planet_count,
                    radius = 1,
                    position = new THREE.Vector3(10, 0, 0),
                    rotation = new THREE.Vector3(),
                    rot_speed = new THREE.Vector3(0, random_float(1, 2), 0),
                    orbit_speed = random_float(0.001, 0.05),
                    parent_obj = p,
                    has_ocean = false,
                );

            elements.push(m);
            moon_count++;

        }

        planet_count++;

    }

}


/*
   returns a random number
*/
function random_number(min=1, max=10) {
    return Math.round(Math.random() * (max - min) + min);
}


/*
   returns a random float
*/
function random_float(min=1, max=10) {
    return Math.random() * (max - min) + min;
}


function random_boolean() {
    return random_number(0, 1) == 1;
}



/*
   Time functions
*/
function increase_time() {
    if (time_delta+time_change <= 50)
        time_delta += time_change;
}

function decrease_time() {
    if (time_delta-time_change >= -50)
        time_delta -= time_change;
}

function reset_time() {
    time_delta = 1;
}



/*
   Camera functions
*/
function toggle_camera_mode() {

    // toggle camera mode
    // update starfield rotation if required

}


// direction = 1 (forward) or 0 (backward)
function change_camera_focus(direction) {
    if (direction == 1) {
        camera_child_index += 1;
        if (camera_child_index > planets.length-1)
            camera_child_index = 0;

    } else if (direction == 0) {
        camera_child_index -= 1;
        if (camera_child_index < 0)
            camera_child_index = planets.length-1;
    }

    camera.change_child( planets[camera_child_index] );
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
    if (debug) {
        debug = false;
        ambientlight.color = new THREE.Color(0.12, 0.12, 0.12);
    }
    else {
        debug = true;
        ambientlight.color = new THREE.Color(1, 1, 1);
    }

    for (var i=0; i<elements.length; i++)
        elements[i].wireframe(debug);

}
