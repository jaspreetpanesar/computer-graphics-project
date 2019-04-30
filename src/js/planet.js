

class Planet {

    static segments = 32;
    static color = new THREE.Color(0.5, 0.3, 0.1);

    // TODO for rot_speed get vertex instead so that it can rotate at multiple speeds and angles
    // same for orbit_speed

    constructor(name='planet', radius=5, position=new THREE.Vector3(), rotation=new THREE.Vector3(), rot_speed=new THREE.Vector3(), orbit_speed=0, parent_obj=null, has_ocean=false) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.rot_speed = rot_speed;
        this.orbit_speed = orbit_speed;
        this.parent_obj = parent_obj;

        // generated fields
        this.geometry = new THREE.SphereGeometry(radius, Planet.segments, Planet.segments);
        this.material = new THREE.MeshLambertMaterial();
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

        // create ocean level if required
        if (has_ocean) {
            this.ocean = new Ocean(this, radius);
            this.planet.add(this.ocean.model);
        } else {
            this.ocean = null;
        }

        if (this.parent_obj) {
            this.orbitGroup = new THREE.Group();
            this.orbitGroup.add(this.planet);
            this.parent_obj.model.add(this.orbitGroup);
            

            scene.add(this.orbitGroup);
        }

        // // moon test
        // var geometry = new THREE.SphereGeometry(1, Planet.segments, Planet.segments);
        // var material = new THREE.MeshLambertMaterial();
        // this.moon = new THREE.Mesh(geometry, material);
        // this.planet.add(this.moon);
        // this.moon.position.set(this.radius+2, 0, 0);

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
        this.planet.rotation.x += this.rot_speed.x;
        this.planet.rotation.y += this.rot_speed.y;
        this.planet.rotation.z += this.rot_speed.z;
    }


    // rotate around parent_obj
    orbit() {
        this.orbitGroup.position.set(
                    this.parent_obj.get_world_position('x'),
                    this.parent_obj.get_world_position('y'),
                    this.parent_obj.get_world_position('z')
                );

        this.orbitGroup.rotation.y += this.orbit_speed;
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

}


