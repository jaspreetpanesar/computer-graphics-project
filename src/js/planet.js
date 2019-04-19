

class Planet {

    static widthSegments = 32;
    static heightSegments = 32;

    // TODO for rot_speed get vertex instead so that it can rotate at multiple speeds and angles
    // same for orbit_speed

    constructor(name, radius, rot_speed=0.0, position=null,  ordit_speed=0.0, parent_obj = null) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.rot_speed = rot_speed;
        this.ordit_speed = ordit_speed;
        this.parent_obj = parent_obj;

        // object fields
        this.geometry = new THREE.SphereGeometry(this.radius, Planet.widthSegments, Planet.heightSegments);
        this.material = new THREE.MeshBasicMaterial();
        this.material.wireframe = true;
        this.model = new THREE.Mesh(this.geometry, this.material);

    }

    create() {

    }


    rotate() {
        this.model.rotation.y += this.rot_speed;
    }


    orbit() {

    }


    show() {
        scene.add(this.model);
    }


    update() {
        // do self rotation
        this.rotate();

        // do self orbit around parent


        // console.log(this.name + ' update called');
    }

}


