// main.js
// stores main renderer, scene, resize function and update loop

var scene, renderer, camera, controls, ambientlight, gui;

var elements = [];  // all elements which require updates
var planets = [];   // planets only

var running = false;
var debug = false;

var time_delta = 1;
var time_change = 0.01;
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

        camera.update();
        renderer.render(scene, camera.camera);
        controls.update();
        requestAnimationFrame(updateloop);

    }

}

/*
   load scene, all elements and controls
*/
function load() {
    scene = new THREE.Scene();

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
    controls.enablePan = false;

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

    SolarSystem.create();

    // start and stop elements updating using spacebar
    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {

            // start/stop rendering/updating
            case 32: // space bar
                if (running)
                    stop();
                else
                    run();
                break;

            // wireframes on
            case 68: // d
                toggle_debug();
                break;

            // speed up time
            case 187: // =
                if (running)
                    Time.increase_time();
                break;

            // slow down time
            case 189: // -
                if (running)
                    Time.decrease_time();
                break;

            // reset time
            case 48: // 0
                if (running)
                    Time.reset_time();
                break;

            // change camera child (left)
            case 69: // q
                if (running)
                    camera.change_focus(0);
                break;

            // change camera child (right)
            case 81: // e
                if (running)
                    camera.change_focus(1);
                break;

            // change camera mode
            case 67: // c
                if (running)
                    camera.toggle_mode();
                break;

            // zoom into planet
            case 87: // w
                if (running)
                    camera.ZoomAdder();
                break;

            // zoom out of planet
            case 83: // s
                if (running)
                    camera.ZoomSubtractor();
                break;

        }
    }, false);


    // GUI
    gui = new dat.GUI({
        height: 5 * 32 - 1
    });

    for (var i=0; i<planets.length; i++){
        gui.add(planets[i], 'name').name("Name");
        gui.add(planets[i], 'orbit_speed').name("Orbit Speed");
        gui.add(planets[i].rot_speed, 'y').name("Rotation Speed");
        gui.add(planets[i].moons, 'length').name("Number of Moons").listen();

        gui.add(planets[i], 'scale', 0.5, 2).name("Scale Value");
        gui.add(planets[i], 'update_scale').name("Update Scale");

        gui.add(planets[i], 'add_moon').name("Add Moon");
        gui.add(planets[i], 'remove_moon').name("Remove Moon");
        gui.add(planets[i], 'regenerate_terrain').name("Regenerate Terrain");
    }

}

/*
   Solar System Functions
*/

class SolarSystem {

    static clear() {

        while (scene.children.length > 0)
            scene.remove(scene.children[0]);

        elements = [];
        planets = [];
    }


    static create() {

        ambientlight = new THREE.AmbientLight(new THREE.Color(0.12, 0.12, 0.12));
        scene.add(ambientlight);

        starfield = new Starfield();
        sun = new Sun('sun', 20, new THREE.Vector3(0, 0, 0));
        elements.push(sun);

        var planet_count = random_number(2, 4);

        for (var i=0; i<planet_count; i++) {
            SolarSystem.add_planet();
        }

        camera.goto_planet(0);
    }


    static remove_planet(index) {
        if (index < 0 || index >= planets.length)
            return;

        var p = planets[index];
        remove_from_array(planets, p);
        remove_from_array(elements, p);
        p.destroy();

        if (planets.length <= 0)
            camera.change_mode("full");
        else
            camera.goto_planet(0);
    }


    static add_planet() {
        var p = new Planet(
                    "Planet " + planets.length,
                    random_number(3, 6),
                    new THREE.Vector3(250+100*planets.length, random_number(0, 50), random_number(-20, 20)),
                    new THREE.Vector3(),
                    new THREE.Vector3(0, random_float(0.0001, 0.0008), 0),
                    random_float(0.001, 0.005),
                    sun,
                    random_boolean(),
                    true
                );

        elements.push(p);
        planets.push(p);

        // create moons
        var moon_count = random_number(1, 3);
        for (var j=0; j<moon_count; j++) {
            p.add_moon();
        }
    }


    static reset() {
        SolarSystem.clear();
        SolarSystem.create();
    }

}







// returns a random number
function random_number(min=1, max=10) {
    return Math.round(Math.random() * (max - min) + min);
}


// returns a random float
function random_float(min=1, max=10) {
    return Math.random() * (max - min) + min;
}

// returns random bool
function random_boolean() {
    return random_number(0, 1) == 1;
}

function remove_from_array(array, object) {
    var index = array.indexOf(object);
    if (index > -1)
        array.splice(index, 1);
}



/*
   Time functions
*/
class Time {

    static increase_time() {
        if (time_delta+time_change <= 50)
            time_delta += time_change;
    }

    static decrease_time() {
        if (time_delta-time_change >= -50)
            time_delta -= time_change;
    }

    static reset_time() {
        time_delta = 1;
    }

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
    requestAnimationFrame(updateloop);
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




