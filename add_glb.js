import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';

let camera, scene, renderer;
let car1, car2, car3;
let controls, water, sun, mesh;

init();
animate();

function init() {

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set( -10, 10, 10 );

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	container.appendChild( renderer.domElement );

	sun = new THREE.Vector3();

	// Water

	const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

	water = new Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load( './assets/model/textures/waternormals.jpg', function ( texture ) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			} ),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 3.7,
			fog: scene.fog !== undefined
		}
	);

	water.rotation.x = - Math.PI / 2;

	scene.add( water );

	// Skybox

	const sky = new Sky();
	sky.scale.setScalar( 10000 );
	scene.add( sky );

	const skyUniforms = sky.material.uniforms;

	skyUniforms[ 'turbidity' ].value = 10;
	skyUniforms[ 'rayleigh' ].value = 2;
	skyUniforms[ 'mieCoefficient' ].value = 0.005;
	skyUniforms[ 'mieDirectionalG' ].value = 0.8;

	const parameters = {
		elevation: 0.1,
		azimuth: 180
	};
	const pmremGenerator = new THREE.PMREMGenerator( renderer );
	const sceneEnv = new THREE.Scene();

	let renderTarget;

	function updateSun() {

		const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
		const theta = THREE.MathUtils.degToRad( parameters.azimuth );

		sun.setFromSphericalCoords( 1, phi, theta );

		sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
		water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

		if ( renderTarget !== undefined ) renderTarget.dispose();

		sceneEnv.add( sky );
		renderTarget = pmremGenerator.fromScene( sceneEnv );
		// scene.add( sky );

		scene.environment = renderTarget.texture;

	}

	updateSun();


	new RGBELoader()
		.setPath( './assets/model/textures/equirectangular/' )
		.load( 'blouberg_sunrise_2_1k.hdr', function ( texture ) {		//配置环境相关

			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = texture;
			scene.environment = texture;

			render();

			// model

			const loader = new GLTFLoader().setPath( './assets/model/glb_model/' );
			loader.load( 'mclaren_720s_lbwk_unfinished.glb', async function ( gltf ) {

				const model = gltf.scene;

				model.position.x = -5
				model.position.y = -0.1;

				// wait until the model can be added to the scene without blocking due to shader compilation

				await renderer.compileAsync( model, camera, scene );

				scene.add( model );

				car1 = model;

				render();

			} );

			const loader2 = new GLTFLoader().setPath( './assets/model/glb_model/' );
			loader2.load( 'bmw_m8_competition_widebody.glb', async function ( gltf ) {

				const model = gltf.scene;
				console.log(model);
				// model.scale.set( 2, 2, 2 );

				model.position.x = 0;
				model.position.y = 0.1;
				// model.rotation.y = Math.PI / 1;

				// wait until the model can be added to the scene without blocking due to shader compilation

				await renderer.compileAsync( model, camera, scene );

				scene.add( model );

				car2 = model;

				render();

			} );

			const loader3 = new GLTFLoader().setPath( './assets/model/glb_model/' );
			loader3.load( 'aventador_svj_black-ghosttm.glb', async function ( gltf ) {

				const model = gltf.scene;

				model.position.x = 5;
				model.position.y = -0.1;
				model.rotation.y = Math.PI / 1;

				// wait until the model can be added to the scene without blocking due to shader compilation

				await renderer.compileAsync( model, camera, scene );

				scene.add( model );

				car3 = model;

				render();

			} );

		} );

	

	const controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // use if there is no animation loop
	controls.minDistance = 2;
	controls.maxDistance = 10;
	controls.target.set( 0, 0, - 0.2 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function animate() {
    requestAnimationFrame(animate);
    // 每帧旋转模型一定的角度（这里以每秒360度为例）
    // car1.rotation.y += 0.01; 
    // car2.rotation.y += 0.01; 
    // car3.rotation.y += 0.01; 
	water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    render();
}

function render() {

	renderer.render( scene, camera );

}