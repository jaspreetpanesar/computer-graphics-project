
class Ocean {

    static segments = 64;
    static updatemodifier = 0.00001; // rate of ocean level chance
    static sealevel = -0.01; // starting position of ocean is radius + sealevel
    static maximum = 1.005; // largest ocean will be raised during high tide

    static color_list = [
        "#b3f0ff",
        "#00ccff",
        "#33d6ff",
        "#4ddbff",
        "#66e0ff",
        "#00b8e6",
        "#adebeb",
        "#99e6e6",
        "#33cccc",
        "#5cd6d6",
        "#0099ff",
        "#4db8ff",
        "#008ae6"
    ];

    tide = 'lowering'; // defines weather tide is currently raising or lowering

    constructor(parent_obj, radius,) {
        this.parent_obj = parent_obj;
        this.radius = radius + Ocean.sealevel;
        this.scale = 1;
        this.color = Ocean.random_color();

        // generate fields
        this.geometry = new THREE.IcosahedronGeometry(this.radius, 5);
        this.material = new THREE.MeshPhongMaterial();
        this.material.color = this.color;
        this.material.wireframe = debug;
        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.receiveShadow = true;

        scene.add(this.model)
    }

    static random_color() {
        var index = random_number(0, Ocean.color_list.length-1);
        return new THREE.Color(Ocean.color_list[index]);
    }


    lower_tide() {
        var scale = this.scale - (this.scale * (Ocean.updatemodifier * time.time_delta));
        if (scale > Ocean.maximum || scale <= 1)
            return false;
        this.model.scale.x = scale;
        this.model.scale.y = scale;
        this.model.scale.z = scale;
        this.scale = scale;
        return true;
    }

    raise_tide() {
        var scale = this.scale + (this.scale * (Ocean.updatemodifier * time.time_delta));
        if (scale > Ocean.maximum || scale <= 1)
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
