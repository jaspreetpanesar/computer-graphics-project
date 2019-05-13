// starfield.js


class Starfield {

    static segments = 128;
    static color = new THREE.Color(1, 1, 1);

    constructor(name='starfield', radius=500, position=new THREE.Vector3()) {
        this.name = name;
        this.radius = radius;
        this.position = position;

        // this.geometry = new THREE.SphereGeometry(this.radius, Starfield.segments, Starfield.segments);
        this.geometry = new THREE.BoxGeometry(1000, 1000, 1000);

        // load starfield texture and add to material
        var texture = new THREE.TextureLoader().load('textures/starfield.jpg');
        this.material = new THREE.MeshPhongMaterial( { map: texture } );
        this.material.color = Starfield.color;
        this.material.side = THREE.BackSide;
        this.material.wireframe = debug;
        this.material.shininess = 0;

        this.model = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.model);

    }


    update() {
    }


    wireframe(show) {
        this.material.wireframe = show;
    }

}


