import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let camera, scene, renderer;

init();

function init() {

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
	camera.position.set( - 1.8, 0.6, 2.7 );

	scene = new THREE.Scene();

	new RGBELoader()
		.setPath( './assets/model/textures/equirectangular/' )
		.load( 'royal_esplanade_1k.hdr', function ( texture ) {		//配置环境相关

			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = texture;
			scene.environment = texture;

			render();

			// model

			const loader = new GLTFLoader().setPath( './assets/model/gltf/DamagedHelmet/glTF/' );
			loader.load( 'DamagedHelmet.gltf', async function ( gltf ) {

				const model = gltf.scene;
				const mesh = model.children[0];

				const texLoader = new THREE.TextureLoader();
				// .load()方法加载图像，返回一个纹理对象Texture
				const texture_water = texLoader.load('./assets/model/textures/water.jpg');
				// mesh.material.map = texture_water;

				// 递归遍历所有模型节点批量修改材质
				gltf.scene.traverse(function(obj) {
					if (obj.isMesh) {//判断是否是网格模型
						console.log('模型节点',obj);
						console.log('模型节点名字',obj.name);
						// 重新设置材质
						// obj.material = new THREE.MeshStandardMaterial({
						// 	color:0xff0000,
						// });
					}
				});
				//用代码方式解决mesh共享材质问题
				// gltf.scene.getObjectByName("小区房子").traverse(function (obj) {
				// 	if (obj.isMesh) {
				// 		// .material.clone()返回一个新材质对象，和原来一样，重新赋值给.material属性
				// 		obj.material = obj.material.clone();
				// 	}
				// });
				// mesh1.material.color.set(0xffff00);
				// mesh2.material.color.set(0x00ff00);



				// wait until the model can be added to the scene without blocking due to shader compilation

				await renderer.compileAsync( model, camera, scene );

				scene.add( model );

				render();

			} );

		} );

		
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	container.appendChild( renderer.domElement );


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

//

function render() {

	renderer.render( scene, camera );

}