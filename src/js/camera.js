

class CustomCamera {

    static fov = 45;
    static ratio = (window.innerWidth/window.innerHeight);
    static near = 0.1;
    static far = 2000;

    state = "orbit" // orbit or full

    constructor(child=null) {
        this.camera = new THREE.PerspectiveCamera(CustomCamera.fov, CustomCamera.ratio, CustomCamera.near, CustomCamera.far);
        this.camera.position.set(0, 0, 200);
        this.child = child;
    }

    toggle_state() {
        if (this.state == "orbit")
            this.state = "full";
        else
            this.state = "orbit";
    }

    change_child(child) {
        this.child = child;

    }


    update() {
        if (this.state == "orbit") {
            if (this.child) {
                this.camera.position.set(
                    this.child.get_world_position('x'),
                    this.child.get_world_position('y'),
                    this.child.get_world_position('z')
                    );

                    this.camera.lookAt(
                        this.child.get_world_position('x'),
                        this.child.get_world_position('y'),
                        this.child.get_world_position('z')
                        );
            }
        } else {

        }
    }


}
