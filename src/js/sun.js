// sun.js
// all functions relating to the sun object
// includes: physical model and point light

class Sun {

    static suncolor = new THREE.Color(1, 1, 0.7);
    static color = new THREE.Color(1, 1, 1);
    static intensity = 1.5;
    static distance = 0; // 0 for no limit
    static decay = 2;

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
        scene.add(this.model);

        // create light
        this.light = new THREE.PointLight(Sun.color, Sun.intensity, Sun.distance, Sun.decay);
        this.light.castShadow = true;

        // add light to the sun
        this.model.add(this.light);
        scene.add(this.light);

        /*
        // lenseflare
        var textureLoader = new THREE.TextureLoader();
        var textureFlare0 = textureLoader.load( 'textures/lensflare0.png' );
        var textureFlare3 = textureLoader.load( 'textures/lensflare3.png' );

        var lensflare = new THREE.Lensflare();
        lensflare.addElement( new THREE.LensflareElement( textureFlare0, 700, 0, this.light.color ) );
        lensflare.addElement( new THREE.LensflareElement( textureFlare3, 60, 0.6 ) );
        lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 0.7 ) );
        lensflare.addElement( new THREE.LensflareElement( textureFlare3, 120, 0.9 ) );
        lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 1 ) );
        this.light.add( lensflare );
        */

    }

    get_world_position(axis) {
        var pos = new THREE.Vector3();
        pos.setFromMatrixPosition(this.model.matrixWorld);
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
                return this.model.position.x;
            case 'y':
                return this.model.position.y;
            case 'z':
                return this.model.position.z;
        }
    }


    update() {
    }


    wireframe(show) {
        this.material.wireframe = show;
    }



}



