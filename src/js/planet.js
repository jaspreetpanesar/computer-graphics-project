

class Planet {

    static segments = 32;

    static planet_color_list = [
        [102, 51, 0],
        [51, 102, 0],
        [0, 51, 0],
        [1, 0, 0],
    ];

    static moon_color_list = [
        [255, 255, 255],
        [153, 153, 102],
        [61, 61, 41],
        [21, 21, 30],
    ]

    static planet_constants = {
        'radius': {'min': 3, 'max': 6},
        'rotation_speed': {
            'x': {'min': 0, 'max': 0},
            'y': {'min': 0.0001, 'max': 0.0008},
            'z': {'min': 0, 'max': 0}
        },
        'orbit_speed': {'min': 0.001, 'max': 0.005}
    }

    static moon_constants = {
        'radius': {'min': 0.2, 'max': 1.5},
        'rotation_speed': {
            'x': {'min': 0, 'max': 0},
            'y': {'min': 0.0001, 'max': 0.0005},
            'z': {'min': 0, 'max': 0}
        },
        'orbit_speed': {'min': 0.001, 'max': 0.015}
    }

    constructor(name='planet', radius=5, position=new THREE.Vector3(), rotation=new THREE.Vector3(), rot_speed=new THREE.Vector3(), orbit_speed=0, parent_obj=null, has_ocean=false, is_moon=false) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.rot_speed = rot_speed;
        this.orbit_speed = orbit_speed;
        this.parent_obj = parent_obj;
        this.scale = 1;
        //this.color = hexToRGB(Planet.planet_color_list[random_number(0, Planet.planet_color_list.length-1)]);
        this.color = Planet.random_color(is_moon);
        this.is_moon = is_moon;

        this.geometry = new THREE.IcosahedronGeometry(radius, 5);

        if (!this.is_moon)
            this.material = new THREE.ShaderMaterial( {
                uniforms: {
                    time: {type: "f", value: random_float(1, 10)},
                    weight: {type: "f", value: random_float(0.04*this.radius, 0.10*this.radius)},
                    vcolor: {value: this.color},
                    sunlight: {value: [0, 0, 0]}
                },
                vertexShader: document.getElementById('vertexShader').textContent,
                fragmentShader: document.getElementById('fragmentShader').textContent,
            });
        else
            this.material = new THREE.ShaderMaterial( {
                uniforms: {
                    time: {type: "f", value: random_float(1, 10)},
                    weight: {type: "f", value: random_float(0.1*this.radius, 0.2*this.radius)},
                    vcolor: {value: this.color},
                    sunlight: {value: [0, 0, 0]}
                },
                vertexShader: document.getElementById('vertexShader').textContent,
                fragmentShader: document.getElementById('fragmentShader').textContent,
            });

        // generated fields
        // this.geometry = new THREE.SphereGeometry(radius, Planet.segments, Planet.segments);
        // this.material = new THREE.MeshLambertMaterial();

        this.material.color = Planet.color;
        this.material.wireframe = debug;
        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.castShadow = true;
        this.model.receiveShadow = true;

        // grouping of all planet objects and set positions
        this.planet = new THREE.Group();
        this.planet.position.set(position.x, position.y, position.z);
        this.planet.rotation.set(rotation.x, rotation.y, rotation.z);
        this.planet.add(this.model);

        scene.add(this.planet);

        this.moons = []; // array of all connected moons

        // create ocean level if required
        if (has_ocean) {
            this.add_ocean();
        } else {
            this.ocean = null;
        }

        if (this.parent_obj) {
            this.orbitGroup = new THREE.Group();
            this.orbitGroup.add(this.planet);
            this.parent_obj.model.add(this.orbitGroup);


            scene.add(this.orbitGroup);
        }


    }


    static random_color(is_moon) {
        if (is_moon)
            var color_list = Planet.moon_color_list;
        else
            var color_list = Planet.planet_color_list;
        var color = color_list[random_number(0, color_list.length-1)]
        return [color[0]/255, color[1]/255, color[2]/255];
    }


    sun_direction() {
        var dir = new THREE.Vector3();
        var sunvec = new THREE.Vector3(sun.get_world_position('x'), sun.get_world_position('y'), sun.get_world_position('z'));
        var myvec = new THREE.Vector3(this.get_world_position('x'), this.get_world_position('y'), this.get_world_position('z'));
        return dir.subVectors(myvec, sunvec).normalize();
    }


    addOrbitGroup() {
        if (this.parent_obj) {
            // create pivot at parent coords
            // add pivot to parent
            // add this.model to pivot

            this.orbitGroup = new THREE.Group();
            this.orbitGroup.add(this.planet);
            this.parent_obj.model.add(this.orbitGroup);
            console.log(this.parent_obj.model.children);
        }
    }


    update_scale() {
        this.planet.scale.x = this.scale;
        this.planet.scale.y = this.scale;
        this.planet.scale.z = this.scale;
    }


    // move the planet using relative coordinates
    moveto(position=new THREE.Vector3()) {
        this.planet.position.x += position.x;
        this.planet.position.y += position.y;
        this.planet.position.z += position.z;
    }


    // rotate in place (using Group object)
    rotate() {
        this.planet.rotation.x += (this.rot_speed.x * time_delta);
        this.planet.rotation.y += (this.rot_speed.y * time_delta);
        this.planet.rotation.z += (this.rot_speed.z * time_delta);
    }


    // rotate around parent_obj
    orbit() {
        this.orbitGroup.position.set(
                    this.parent_obj.get_world_position('x'),
                    this.parent_obj.get_world_position('y'),
                    this.parent_obj.get_world_position('z')
                );

        this.orbitGroup.rotation.y += (this.orbit_speed * time_delta);
    }

    get_world_position(axis) {
        var pos = new THREE.Vector3();
        pos.setFromMatrixPosition(this.planet.matrixWorld);
        switch (axis) {
            case 'x':
                return pos.x;
            case 'y':
                return pos.y;
            case 'z':
                return pos.z;
        }
    }

    get_position(axis) {
        switch (axis) {
            case 'x':
                return this.planet.position.x;
            case 'y':
                return this.planet.position.y;
            case 'z':
                return this.planet.position.z;
        }
    }


    add_ocean() {
        if (this.has_ocean)
            return;

        this.ocean = new Ocean(this, this.radius);
        this.planet.add(this.ocean.model);
        this.has_ocean = true;
    }


    remove_ocean() {
        if (!this.has_ocean)
            return;

        this.planet.remove(this.ocean.model);
        scene.remove(this.ocean.model);
        this.ocean = null;
        this.has_ocean = false;
    }


    add_moon(name="Moon") {
        if (this.moons.length > 5)
            return;

        var m = new Planet(
                name,
                random_number(0.2, 1.5), // radius
                new THREE.Vector3(10+20*this.moons.length, random_number(-5, 5), random_number(-5, 5)), //position
                new THREE.Vector3(), // rotation
                new THREE.Vector3(0, random_float(Planet.moon_constants.rotation_speed.y.min, Planet.moon_constants.rotation_speed.y.max), 0), // rot_speed
                random_float(Planet.moon_constants.orbit_speed.min, Planet.moon_constants.orbit_speed.max), // orbit_speed
                this, // parent
                false, // ocean
                true // is moon
                );

        elements.push(m);
        this.moons.push(m);
    }

    remove_moon(index=0) {
        if (index < 0 || index >= this.moons.length)
            return;

        var m = this.moons[index];
        remove_from_array(this.moons, m);
        m.destroy();
    }


    regenerate_terrain() {
        this.model.material.uniforms.time.value = random_float(1, 10);
    }


    update() {
        this.model.material.uniforms.sunlight.value = this.sun_direction();

        if (this.parent_obj)
            this.orbit();

        this.rotate();

        if (this.ocean)
            this.ocean.update();
    }


    wireframe(show) {
        this.material.wireframe = show;
        if (this.ocean)
            this.ocean.wireframe(show);
    }


    destroy() {
        for (var i=0; i<this.moons.length; i++)
            this.moons[i].destroy();

        if (this.parent_obj)
            scene.remove(this.orbitGroup);

        scene.remove(this.planet);
    }

}
