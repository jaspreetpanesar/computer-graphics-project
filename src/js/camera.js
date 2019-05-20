

class CustomCamera {

    static fov = 45;
    static ratio = (window.innerWidth/window.innerHeight);
    static near = 0.1;
    static far = 2500;
    zoom = 50;

    state = "orbit" // orbit or full


    constructor(child=null) {
        this.camera = new THREE.PerspectiveCamera(CustomCamera.fov, CustomCamera.ratio, CustomCamera.near, CustomCamera.far);
        this.camera.position.set(0, 0, 200);
        this.child = child;

        if (this.child)
            child.add(this.camera);
    }

    change_state(state) {
        this.state = state;
    }

    toggle_state() {
        if (this.state == "orbit") {
            this.camera.position.set(0, 1000, 0);
            this.camera.lookAt(0, 0, 0);
            this.state = "full";
        }
        else
            this.state = "orbit";
    }

    change_child(child) {
        this.child = child;

    }

    ZoomAdder(){
      this.zoom = this.zoom -2
    }

    ZoomSubtractor(){
      this.zoom = this.zoom +2

    }

    update() {
        if (this.state == "orbit") {
            if (this.child) {
                this.camera.position.set(
                    this.child.get_world_position('x') - this.zoom,
                    this.child.get_world_position('y'),
                    this.child.get_world_position('z')
                    );

                    this.camera.lookAt(
                        this.child.get_world_position('x'),
                        this.child.get_world_position('y'),
                        this.child.get_world_position('z')
                        );
            }
        } else if (this.state == "full") {
          // this.camera.position.set(0, 0, 200);
          // this.camera.rotation.set(0,0,0);


        }
    }


}
