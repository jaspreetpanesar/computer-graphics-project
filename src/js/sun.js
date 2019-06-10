// sun.js
// all functions relating to the sun object
// includes: physical model and point light

class Sun {

    static suncolor = new THREE.Color(1, 1, 0.7);
    static color = new THREE.Color(1, 1, 1);
    static intensity = 1.5;
    static distance = 1500; // 0 for no limit | 2000 so it doesn't light starfield
    static decay = 2;

    static segments = 64;

    constructor(name='sun', radius=5, position=new THREE.Vector3()) {
        this.name = name;
        this.radius = radius;
        this.position = position;

        // load sun texture
        var texture = new THREE.TextureLoader().load('textures/sun.jpg');

        // generated fields
        this.geometry = new THREE.SphereGeometry(this.radius, Sun.segments, Sun.segments);
        this.material = new THREE.MeshBasicMaterial({map:texture});
        this.material.color = Sun.suncolor;
        this.material.wireframe = debug;
        this.material.castShadow = false;
        this.material.depthWrite = false;

        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.position.set(position.x, position.y, position.z);
        scene.add(this.model);

        // create light
        this.light = new THREE.PointLight(Sun.color, Sun.intensity, Sun.distance, Sun.decay);
        this.light.castShadow = true;

        // add light to the sun
        this.model.add(this.light);
        scene.add(this.light);

        // lensflare textures
        var textureLoader = new THREE.TextureLoader();
        var textureFlare0 = textureLoader.load( 'textures/lensflare0.png' );
        var textureFlare3 = textureLoader.load( 'textures/lensflare3.png' );

        this.lensflare = new THREE.Lensflare();

        // glow emanating from light
        this.lensflare.addElement( new THREE.LensflareElement( textureFlare0, 60, 0, this.light.color ) );

        //floating spheres effect when looking at light
        this.lensflare.addElement( new THREE.LensflareElement( textureFlare3, 60, 0.6 ) );
        this.lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 0.7 ) );
        this.lensflare.addElement( new THREE.LensflareElement( textureFlare3, 120, 0.9) );
        this.lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 1 ) );

        this.light.add( this.lensflare );

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
        // rotates very slowly to imitate animating texture
        this.model.rotation.x += 0.0002 * time.time_delta;
        this.model.rotation.y += 0.0002 * time.time_delta;
        this.model.rotation.z += 0.0002 * time.time_delta;
    }


    wireframe(show) {
        this.material.wireframe = show;
    }



}
