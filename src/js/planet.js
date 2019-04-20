

class Planet {

    static segments = 32;
    static color = new THREE.Color(0.5, 0.3, 0.1);

    // TODO for rot_speed get vertex instead so that it can rotate at multiple speeds and angles
    // same for orbit_speed

    constructor(name='planet', radius=5, position=new THREE.Vector3(), rotation=new THREE.Vector3(), rot_speed=new THREE.Vector3(), orbit_speed=0, parent_obj = null, has_ocean=false) {
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

        // set original position
        this.model.position.set(position.x, position.y, position.z);
        this.model.rotation.set(rotation.x, rotation.y, rotation.z);


        // create ocean level if required
        if (has_ocean) {
            this.ocean = new Ocean(this, radius);
        } else {
            this.ocean = null;
        }

    }


    create() {

    }


    moveto() {

    }


    rotate() {

        // this.model.geometry.center();
        this.model.rotation.x += this.rot_speed.x;
        this.model.rotation.y += this.rot_speed.y;
        this.model.rotation.z += this.rot_speed.z;

        // rotate ocean also so there is no clipping with planet
        if (this.ocean)
            this.ocean.rotate(this.rot_speed);

    }


    orbit() {

    }


    show() {
        scene.add(this.model);
        if (this.ocean)
            scene.add(this.ocean.model);
    }


    update() {
        // do self rotation
        this.rotate();

        // do self orbit around parent


        // console.log(this.name + ' update called');
    }

    wireframe(show) {
        this.material.wireframe = show;
        if (this.ocean)
            this.ocean.wireframe(show);
    }

}


