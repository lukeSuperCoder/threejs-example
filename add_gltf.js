import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let camera, scene, renderer;

init();

// setTimeout(() => {
// 	saveFile();
// }, 3000);

function init() {

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
	camera.position.set( - 1.8, 0.6, 2.7 );

	scene = new THREE.Scene();

	const light = new THREE.PointLight( 0xffffff, 10 );
	scene.add( light );

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
				const textureCube = new THREE.CubeTextureLoader()
				.load(['./assets/model/textures/water.jpg','./assets/model/textures/water.jpg','./assets/model/textures/water.jpg','./assets/model/textures/water.jpg','./assets/model/textures/water.jpg','./assets/model/textures/water.jpg','./assets/model/textures/water.jpg']);
				
				// 递归遍历所有模型节点批量修改材质
				gltf.scene.traverse(function(obj) {
					if (obj.isMesh) {//判断是否是网格模型
						console.log('模型节点',obj);
						console.log('模型节点名字',obj.name);
						// 重新设置材质
						// obj.material = new THREE.MeshStandardMaterial({
						// 	// color:0xff0000,
						// 	metalness: 0.3,//表示材质像金属的程度, 非金属材料,如木材或石材,使用0.0,金属使用1.0。
						// 	roughness: 0.1,//表面粗糙度0.0表示平滑的镜面反射,1.0表示完全漫反射,默认0.5。
						// 	envMapIntensity: 0.5,	//属性主要用来设置模型表面反射周围环境贴图的能力
						// 	envMap:textureCube,
						// 	clearcoat: 1,//物体表面清漆层或者说透明涂层的厚度
						// 	clearcoatRoughness: 0.3,//透明涂层表面的粗糙度
						// 	ior: 2.2,//折射率
						// 	transmission: 1, //玻璃材质透光率，transmission替代opacity
						// });
					}
				});
				scene.environment = textureCube;
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

		
	renderer = new THREE.WebGLRenderer({ 
		antialias: true,
		alpha: true,
		//想把canvas画布上内容下载到本地，需要设置为true
    	preserveDrawingBuffer:true,
 	});
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

//保存图片
function saveFile() {
    const link = document.createElement('a');
	// 通过超链接herf属性，设置要保存到文件中的数据
	const canvas = renderer.domElement; //获取canvas对象
	link.href = canvas.toDataURL("image/png");
	link.download = 'threejs.png'; //下载文件名
    link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
}