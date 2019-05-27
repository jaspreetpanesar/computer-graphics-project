// ring.js
// A ring which orbits around planets


class Ring {

    static segments = 32;

    constructor(parent_obj, distance, size) {
        this.parent_obj = parent_obj;
        this.distance = distance;
        this.size = size;

        // generate fields

        /*
        RingGeometry(innerRadius : Float, outerRadius : Float, thetaSegments : Integer, phiSegments : Integer, thetaStart : Float, thetaLength : Float)

            innerRadius — Default is 0.5. 
            outerRadius — Default is 1. 
            thetaSegments — Number of segments. A higher number means the ring will be more round. Minimum is 3. Default is 8. 
            phiSegments — Minimum is 1. Default is 8.
            thetaStart — Starting angle. Default is 0. 
            thetaLength — Central angle. Default is Math.PI * 2.
        */

        this.geometry = new THREE.RingGeometry(distance, distance+size, Ring.segments);
        this.material = new THREE.MeshLambertMaterial();
        this.material.side = THREE.DoubleSide;
        this.material.wireframe = debug;
        this.model = new THREE.Mesh(this.geometry, this.material);
        // this.model.castShadow = true;
        // this.model.receiveShadow = true;

        this.model.rotation.x = Math.PI/2;

        scene.add(this.model);

    }


    update() {

    }


    wireframe(show) {
        this.material.wireframe = show;
    }

}
