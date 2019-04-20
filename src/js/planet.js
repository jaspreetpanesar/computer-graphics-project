

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
        this.material = new THREE.MeshPhongMaterial();
        this.material.color = Planet.color;
        this.material.wireframe = debug;
        this.material.castShadow = true;

        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.recieveShadow = true;

        // grouping of all planet objects and set positions
        this.planet = new THREE.Group();
        this.planet.position.set(position.x, position.y, position.z);
        this.planet.rotation.set(rotation.x, rotation.y, rotation.z);

        this.planet.add(this.model);

        // create ocean level if required
        if (has_ocean) {
            this.ocean = new Ocean(this, radius);
            this.planet.add(this.ocean.model);
        } else {
            this.ocean = null;
        }

    }


    // move the planet
    moveto(position=new THREE.Vector3()) {
        this.planet.position.x += position.x;
        this.planet.position.y += position.y;
        this.planet.position.z += position.z;
    }


    // rotate in place (using Group object)
    rotate() {

        // this.planet.rotation.x += this.rot_speed.x;
        // this.planet.rotation.y += this.rot_speed.y;
        // this.planet.rotation.z += this.rot_speed.z;

        this.planet.rotation.x += 0;
        this.planet.rotation.y += 0.101;
        this.planet.rotation.z += 0;

        // this.model.geometry.center();
        // this.model.rotation.x += this.rot_speed.x;
        // this.model.rotation.y += this.rot_speed.y;
        // this.model.rotation.z += this.rot_speed.z;

        // // rotate ocean also so there is no clipping with planet
        // if (this.ocean)
        //     this.ocean.rotate(this.rot_speed);

    }


    // rotate around parent_obj
    orbit() {
        var axis = new THREE.Vector3(0.1, 0, 0);
        var theta = Math.PI/9;

        this.model.position.sub(parent_obj.model.position);
        this.model.position.applyAxisAngle(axis, theta);
        this.model.position.add(parent_obj.model.position);

        this.model.rotateOnAxis(axis, theta);
    }


    // add the planet to the scene
    show() {
        scene.add(this.planet);
    }


    update() {
        // this.orbit();
        this.rotate();


        // console.log(this.name + ' update called');
    }

    wireframe(show) {
        this.material.wireframe = show;
        if (this.ocean)
            this.ocean.wireframe(show);
    }

}


