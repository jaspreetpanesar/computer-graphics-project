// sun.js
// all functions relating to the sun object
// includes: physical model and point light

class Sun {

    static suncolor = new THREE.Color(1, 1, 0.7);
    static color = new THREE.Color(1, 1, 1);
    static intensity = 1;
    static decay = 1000;

    static segments = 64;

    constructor(name='sun', radius=5, position=new THREE.Vector3()) {
        this.name = name;
        this.radius = radius;
        this.position = position;

        // generated fields
        this.geometry = new THREE.SphereGeometry(this.radius, Sun.segments, Sun.segments);
        this.material = new THREE.MeshBasicMaterial();
        this.material.color = Sun.suncolor;
        this.material.wireframe = debug;
        this.material.castShadow = true;

        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.position.set(position.x, position.y, position.z);

        // create light
        this.light = new THREE.PointLight(Sun.color, Sun.intensity, Sun.decay);

        // add light to the sun
        this.model.add(this.light);

    }

    show() {
        scene.add(this.model);
    }


    update() {
        // this.model.position.x -= 0.1;
    }

    wireframe(show) {
        this.material.wireframe = show;
    }



}



