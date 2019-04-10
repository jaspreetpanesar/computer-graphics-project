// earth.js
// all functions in relation to the earth model

var earth_geometry = new THREE.SphereGeometry( 5, 32, 32 );
var earth_material = new THREE.MeshBasicMaterial();
earth_material.color = new THREE.Color(1,1,1);
earth_material.wireframe = true;
var earth_model = new THREE.Mesh( earth_geometry, earth_material );
scene.add(earth_model);


