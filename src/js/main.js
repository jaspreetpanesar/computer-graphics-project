// main.js
// stores main renderer, scene, resize function and update loop

var scene, renderer, camera, controls, ambientlight, gui;

var elements = [];  // all elements which require updates
var planets = [];   // planets only

var running = false;
var debug = false;
var exists = false;

//var time_delta = 1;
var time_change = 0.5;
var camZoom = 1;

var sun, starfield;

var time;

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

    time = new Time();

    // controls
    controls = new THREE.OrbitControls(camera.camera, renderer.domElement);
    controls.maxDistance = 1500;
    controls.minDistance = 750;
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
                    camera.change_focus(1); //returns the current planet
                    //planet_gui(camera_child_index);
                break;

            // change camera child (right)
            case 81: // e
                if (running)
                    camera.change_focus(0); //returns the current planet
                    //planet_gui(camera_child_index);
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

        var planet_count = random_number(3, 6);

        for (var i=0; i<planet_count; i++) {
            SolarSystem.add_planet();
        }

        // GUI
        gui = new dat.GUI({
            height: 5 * 32 - 1
        });

        camera.change_mode("full");
    }


    static remove_planet() {
        if (camera.mode == "full")
            var index = planets.length-1;
        else
            var index = camera.child_index;

        console.log(planets[index]);
        var p = planets[index];
        remove_from_array(planets, p);
        remove_from_array(elements, p);
        p.destroy();
    }


    static add_planet() {

        if (planets.length >= 7)
            return;


        var p = new Planet(
            name_planet(), // name
            random_float(Planet.planet_constants.radius.min, Planet.planet_constants.radius.max), // radius
            new THREE.Vector3(250+100*planets.length, random_number(0, 50), random_number(-20, 20)), // position
            new THREE.Vector3(), // rotation
            new THREE.Vector3(0, random_float(Planet.planet_constants.rotation_speed.y.min, Planet.planet_constants.rotation_speed.y.max), 0), // rotation speed
            random_float(Planet.planet_constants.orbit_speed.min, Planet.planet_constants.orbit_speed.max), // orbit_speed
            sun, // parent_obj
            random_boolean(), // has_ocean
            false // is_moon
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
        gui.destroy(); //destroys exisiting gui
        SolarSystem.create();
    }

}

function planet_camera() {

    gui.destroy();

    gui = new dat.GUI({
        height: 5 * 32 - 1
    });

    var CameraGui = function(){
      this.goto = function(index){
        camera.goto_planet(index);
      };
      this.focus = function(direction){
        camera.change_focus(direction);
      };
    };

    var cameraGui = new CameraGui();

    var num = camera.child_index + 1; //correct planet number
    num = num.toString();

    gui.add(planets[camera.child_index], 'name').name("Name");
    gui.add(planets[camera.child_index], 'orbit_speed', 0.0001, 0.02).name("Orbit Speed");
    gui.add(planets[camera.child_index].rot_speed, 'y', 0.0001, 0.02).name("Rotation Speed");
    gui.add(planets[camera.child_index], 'regenerate_terrain').name("Regenerate Terrain");

    var oceanDropdown = gui.addFolder("Ocean");
    oceanDropdown.add(planets[camera.child_index], 'add_ocean').name("Add Ocean");
    oceanDropdown.add(planets[camera.child_index], 'remove_ocean').name("Remove Ocean");
    oceanDropdown.close();

    var scaleDropdown = gui.addFolder("Scale");
    scaleDropdown.add(planets[camera.child_index], 'scale', 0.5, 2).name("Scale Value");
    scaleDropdown.add(planets[camera.child_index], 'update_scale').name("Update Scale");
    scaleDropdown.close();

    var moonDropdown = gui.addFolder("Moons");
    moonDropdown.add(planets[camera.child_index].moons, 'length').name("Number of Moons").listen();
    moonDropdown.add(planets[camera.child_index], 'add_moon').name("Add Moon");
    moonDropdown.add(planets[camera.child_index], 'remove_moon').name("Remove Moon");
    moonDropdown.close(); //dropdown box starts open

    var cameraDropdown = gui.addFolder("Camera");
    cameraDropdown.add(camera, 'ZoomAdder').name("Zoom In [w]");
    cameraDropdown.add(camera, 'ZoomSubtractor').name("Zoom Out (s)");
    cameraDropdown.open();

    var navigationDropDown = gui.addFolder("Navigation"); //creates dropdown box for navigation
    navigationDropDown.add(camera, 'toggle_mode').name("Toggle Camera [c]");
    navigationDropDown.add({focus : cameraGui.focus.bind(this, 1)}, 'focus').name("Next Planet [e]");
    navigationDropDown.add({focus : cameraGui.focus.bind(this, 0)}, 'focus').name("Previous Planet [q]");
    navigationDropDown.open();

    var solarSystemDropdown = gui.addFolder("Solar System");
    solarSystemDropdown.add(time, 'time_delta', -5, 5).name("Time [-] [=]").listen();
    solarSystemDropdown.add(Time, 'reset_time').name("Reset Time [0]");
    solarSystemDropdown.add(SolarSystem, 'add_planet').name("Add Planet");
    solarSystemDropdown.add(SolarSystem, 'remove_planet').name("Remove Planet");
    solarSystemDropdown.add(SolarSystem, 'reset').name("New Solar System"); //button to create a new solar system
    solarSystemDropdown.open();
}

function top_down_camera(){

  gui.destroy();

  gui = new dat.GUI({
      height: 5 * 32 - 1
  });

  var CameraGui = function(){
    this.goto = function(index){
      camera.goto_planet(index);
    };
    this.focus = function(direction){
      camera.change_focus(direction);
    };
  };

  var cameraGui = new CameraGui();

  var planetDropdown = gui.addFolder("Planets"); //creates dropdown box for each planet

  for (var i=0; i<planets.length; i++){

      planetDropdown.add(planets[i], 'name').name("Name");

  }

  planetDropdown.open();

  var navigationDropDown = gui.addFolder("Navigation"); //creates dropdown box for navigation
  navigationDropDown.add(camera, 'toggle_mode').name("Toggle Camera [c]");
  navigationDropDown.add({focus : cameraGui.focus.bind(this, 1)}, 'focus').name("Next Planet [e]");
  navigationDropDown.add({focus : cameraGui.focus.bind(this, 0)}, 'focus').name("Previous Planet [q]");
  navigationDropDown.open();

  var solarSystemDropdown = gui.addFolder("Solar System");
  solarSystemDropdown.add(time, 'time_delta', -5, 5).name("Time [-] [=]").listen();
  solarSystemDropdown.add(Time, 'reset_time').name("Reset Time [0]");
  solarSystemDropdown.add(SolarSystem, 'add_planet').name("Add Planet");
  solarSystemDropdown.add(SolarSystem, 'remove_planet').name("Remove Planet");
  solarSystemDropdown.add(SolarSystem, 'reset').name("New Solar System"); //button to create a new solar system
  solarSystemDropdown.open();

}


function name_planet() {
    name_list = [
        "Aegir", "Amateru", "Arion", "Arkas", "Brahe", "Dagon", "Dimidium", "Draugr",
        "Dulcinea", "Fortitudo", "Galileo", "Harriot", "Hypatia", "Janssen", "Lipperhey",
        "Majriti", "Meztli", "Orbitar", "Phobetor", "Poltergeist", "Quijote", "Rocinante",
        "Saffar", "Samh", "Smertrios", "Sancho", "Spe", "Tadmor", "Taphao", "Kaew", "Taphao",
        "Thong", "Thestias", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Pluto",
        "Mercury", "Neptune", "Alpha", "Beta", "Centuri"
        ];
    roman_numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

    var copy = true;
    var name;

    // loop used to re-generate name in case there are duplicates
    while (copy) {
        name = name_list[random_number(0, name_list.length)] + " " + roman_numerals[random_number(0, roman_numerals.length-1)];
        copy = false;
        for (var i=0; i<planets.length; i++) {
            if (planets[i].name == name)
                copy = true;
        }
    }

    return name;
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

    constructor(time_delta = 1){
        this.time_delta = time_delta;
    }

    static increase_time() {
        if (time.time_delta+time_change <= 5)
            time.time_delta += time_change;
    }

    static decrease_time() {
        if (time.time_delta-time_change >= -5)
            time.time_delta -= time_change;
    }

    static reset_time() {
        time.time_delta = 1;
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
