
class Ocean {

    static color = new THREE.Color(0, 0.6, 1); // ocean color
    static segments = 32;
    static updatemodifier = 0.001;
    static sealevel = 0.1; // starting position of ocean is radius + sealevel

    constructor(parent_obj, radius, minimum=0.5, maximum=0.5) {
        this.parent_obj = parent_obj;
        this.radius = radius + Ocean.sealevel;

        this.minimum = minimum;
        this.maximum = maximum;

        // generate fields
        this.geometry = new THREE.SphereGeometry(this.radius, Ocean.segments, Ocean.segments);
        this.material = new THREE.MeshPhongMaterial();
        this.material.color = Ocean.color;
        this.material.wireframe = debug;
        this.material.castShadow = false;

        this.model = new THREE.Mesh(this.geometry, this.material);
        this.model.recieveShadow = true;

        this.move();

        this.level = radius;
        this.scale = 1;
    }

    lower_tide() {
        this.scale -= this.scale * Ocean.updatemodifier;
        this.model.scale.x = this.scale;
        this.model.scale.y = this.scale;
        this.model.scale.z = this.scale;
    }

    increase_tide() {
        this.scale += this.scale * Ocean.updatemodifier;
        this.model.scale.x = this.scale;
        this.model.scale.y = this.scale;
        this.model.scale.z = this.scale;
    }


    move() {
        this.model.position.set(
                this.parent_obj.model.position.x, 
                this.parent_obj.model.position.y, 
                this.parent_obj.model.position.z, 
                );
    }

    // allow for rotation so there is no clipping with parent obj
    rotate(angle = THREE.Vector3()) {
        this.model.rotation.x += angle.x;
        this.model.rotation.y += angle.y;
        this.model.rotation.z += angle.z;
    }

    update() {

    }

    wireframe(show) {
        this.material.wireframe = show;
    }

}


