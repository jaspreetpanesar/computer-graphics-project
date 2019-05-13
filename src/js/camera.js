

class CustomCamera {

    state = "orbit" // orbit or full

    constructor(child=null) {
        this.camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 2000);
        this.camera.position.set(0, 0, 200);

        // this.camera.lookAt(0, 0, 1);

        this.child = child;

        // updates camera and scene aspect and size to match window size
        // runs when the window is resized
        window.addEventListener('resize', function() {
            var width = window.innerWidth;
            var height = window.innerHeight;

            renderer.setSize(width, height);
            this.camera.aspect = width/height;
            this.camera.updateProjectionMatrix();

            renderer.render(scene, this.camera);
        });
    }


    change_child(child) {
        this.child = child;
    }


    update() {
        if (state == "orbit")
            if (this.child)
                this.camera.position.set(
                    this.child.get_world_position('x'),
                    this.child.get_world_position('y'),
                    this.child.get_world_position('z')
                        );
    }


}









