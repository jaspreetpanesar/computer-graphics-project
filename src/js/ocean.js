
class Ocean {

    static color = new THREE.Color(0, 0.6, 1); // ocean color
    static segments = 64;
    static updatemodifier = 0.0001; // rate of ocean level chance
    static sealevel = 0.1; // starting position of ocean is radius + sealevel
    static maximum = 1.05; // largest ocean will be raised during high tide

    tide = 'lowering'; // defines weather tide is currently raising or lowering

    constructor(parent_obj, radius,) {
        this.parent_obj = parent_obj;
        this.radius = radius + Ocean.sealevel;
        this.scale = 1;

        // generate fields
        this.geometry = new THREE.SphereGeometry(this.radius, Ocean.segments, Ocean.segments);
        this.material = new THREE.MeshPhongMaterial();
        this.material.color = Ocean.color;
        this.material.wireframe = debug;
        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.receiveShadow = true;
    }


    lower_tide() {
        var scale = this.scale - (this.scale * Ocean.updatemodifier);
        if (scale <= 1)
            return false;
        this.model.scale.x = scale;
        this.model.scale.y = scale;
        this.model.scale.z = scale;
        this.scale = scale;
        return true;
    }

    raise_tide() {
        var scale = this.scale + (this.scale * Ocean.updatemodifier);
        if (scale > Ocean.maximum)
            return false;
        this.model.scale.x = scale;
        this.model.scale.y = scale;
        this.model.scale.z = scale;
        this.scale = scale;
        return true;
    }


    update() {
        if (this.tide == 'lowering')
            if (!this.lower_tide())
                this.tide = 'raising';
        if (this.tide == 'raising')
            if (!this.raise_tide())
                this.tide = 'lowering';
    }

    wireframe(show) {
        this.material.wireframe = show;
    }

}


