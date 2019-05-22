

class Planet {

    static segments = 32;
    static color = new THREE.Color(0.5, 0.3, 0.1);

    constructor(name='planet', radius=5, position=new THREE.Vector3(), rotation=new THREE.Vector3(), rot_speed=new THREE.Vector3(), orbit_speed=0, parent_obj=null, has_ocean=false) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.rot_speed = rot_speed;
        this.orbit_speed = orbit_speed;
        this.parent_obj = parent_obj;

        this.geometry = new THREE.IcosahedronGeometry(radius, 5);
        this.material = new THREE.ShaderMaterial( {

            uniforms: {
                time: {type: "f", value: random_number(0, 50)},
                weight: {type: "f", value: 0.08*this.radius}
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


    // move the planet using relative coordinates
    moveto(position=new THREE.Vector3()) {
        this.planet.position.x += position.x;
        this.planet.position.y += position.y;
        this.planet.position.z += position.z;
    }


    // rotate in place (using Group object)
    // TODO rotate by an angle instead of value, as objects that are further away from the center position rotate much faster than those near the center.
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
        var m = new Planet(
                name,
                random_number(0.5, 1.5),
                new THREE.Vector3(15, 0, 0),
                new THREE.Vector3(),
                new THREE.Vector3(0, random_float(0.0001, 0.0005), 0),
                random_float(0.001, 0.015),
                this,
                false,
                );

        elements.push(m);
        this.moons.push(m);
    }


    remove_moon(index) {
        if (index < 0 || index >= this.moons.length)
            return;

        var m = this.moons[index];
        remove_from_array(this.moons, m);
        m.destroy();
    }


    update() {
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


