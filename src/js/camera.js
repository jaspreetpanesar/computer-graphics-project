
class CustomCamera {

    static fov = 45;
    static ratio = (window.innerWidth/window.innerHeight);
    static near = 0.1;
    static far = 2500;
    static zoom_default = 25;
    static zoom_shift = 2;

    zoom = CustomCamera.zoom_default;
    child_index = 0;
    mode = "orbit" // orbit or full


    constructor(child=null) {
        this.camera = new THREE.PerspectiveCamera(CustomCamera.fov, CustomCamera.ratio, CustomCamera.near, CustomCamera.far);
        this.camera.position.set(0, 0, 200);
        this.child = child;

        if (this.child)
            child.add(this.camera);
    }


    change_mode(mode) {
        this.mode = mode;
        if (this.mode == "full") {
            this.camera.position.set(0, 1000, 0);
            this.camera.lookAt(0, 0, 0);
            this.mode = "full";
            top_down_camera();
        }
    }


    toggle_mode() {
        if (this.mode == "orbit") {
            this.change_mode("full");
            top_down_camera();
        }
        else {
            if (planets.length > 0) {
                this.child_index = 0;
                this.change_mode("orbit");
                this.goto_planet(0);
                planet_camera();
            }
        }
    }


    change_child(child) {
        this.child = child;
    }


    // directions 0 (backward) or 1 (forward)
    change_focus(direction) {
        this.change_mode("orbit");
        if (direction == 1) {
            this.child_index += 1;
            if (this.child_index > planets.length-1)
                this.child_index = 0;
        }
        else if (direction == 0) {
            this.child_index -= 1;
            if (this.child_index < 0)
                this.child_index = planets.length-1;
        }

        this.change_child(planets[this.child_index]);
        planet_camera();
    }


    // start orbiting around specific planet
    goto_planet(index) {
        if (index < 0 || index >= planets.length)
            return;
        this.child_index = index;
        this.change_mode("orbit");
        this.change_child(planets[this.child_index]);
    }


    ZoomAdder(){
        if (this.mode != "orbit")
            return;
        this.zoom = this.zoom - CustomCamera.zoom_shift;
        if (this.zoom < 10)
            this.zoom = 10;
    }


    ZoomSubtractor(){
        if (this.mode != "orbit")
            return;
        this.zoom = this.zoom + CustomCamera.zoom_shift;
        if (this.zoom > 50)
            this.zoom = 50;
    }


    update() {
        if (this.mode == "orbit") {
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
        }
    }


}
