

class Planet {

    static segments = 32;

    // TODO for rot_speed get vertex instead so that it can rotate at multiple speeds and angles
    // same for orbit_speed

    constructor(name='planet', radius=5, position=new THREE.Vector3(), rotation=new THREE.Vector3(), rot_speed=new THREE.Vector3(), orbit_speed=0, parent_obj = null) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.rot_speed = rot_speed;
        this.orbit_speed = orbit_speed;
        this.parent_obj = parent_obj;

        // generated fields
        this.geometry = new THREE.SphereGeometry(this.radius, Planet.segments, Planet.segments);
        this.material = new THREE.MeshPhongMaterial();
        this.material.color = new THREE.Color(0, 0.6, 1);
        this.material.wireframe = false;
        this.material.castShadow = true;

        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.recieveShadow = true;

        // set original position
        this.model.position.set(position.x, position.y, position.z);
        this.model.rotation.set(rotation.x, rotation.y, rotation.z);

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
    }


    orbit() {

    }


    update() {
        // do self rotation
        this.rotate();

        // do self orbit around parent


        // console.log(this.name + ' update called');
    }

}


