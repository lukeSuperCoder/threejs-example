import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//创建几何体
const geometry_box = new THREE.BoxGeometry(1, 1, 1);
const geometry_cap = new THREE.CapsuleGeometry(1,1,10,64);
const geometry_circle = new THREE.CircleGeometry(2,128,0,2*Math.PI);
const geometry_cone = new THREE.ConeGeometry(2,2,128,1,true,0,2*Math.PI);
const geometry_cylinder = new THREE.CylinderGeometry(2,2,3,64);
const geometry_plane = new THREE.PlaneGeometry(1, 1, 10, 10);
const geometry_dodecahedron = new THREE.DodecahedronGeometry(1,5);
const geometry_edge = new THREE.EdgesGeometry(geometry_box,0); //边缘几何体（EdgesGeometry）这可以作为一个辅助对象来查看geometry的边缘。
//多面缓冲几何体
const verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
];

const indicesOfFaces = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
];

const geometry_polyhedron = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 );

//形状缓冲几何体
const x = 0, y = 0;
const heartShape = new THREE.Shape();

heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const geometry_shape = new THREE.ShapeGeometry( heartShape );

//球缓冲几何体
const geometry_sphere = new THREE.SphereGeometry(1, 64, 64);
//圆环缓冲几何体
const geometry_ring = new THREE.RingGeometry(1,2,16,10);
//圆环缓冲扭结几何体
const geometry_torus = new THREE.TorusKnotGeometry(15,2,500,16,5,2,3);

//网格几何体
const geometry_wireframe = new THREE.WireframeGeometry(geometry_shape);
//定义材质
const material = new THREE.MeshBasicMaterial({
    // color: 0x00ffff,
    alphaHash: false,    //启用alphaHash透明度，这是.transparent或.alphaTest的替代方案。如果不透明度低于随机阈值，则不会渲染材质。随机化会引入一些颗粒或噪点，但相较于传统的Alpha blend方式，避免了透明度引起的深度排序问题。使用TAARenderPass可以有效减少噪点。
    opacity: 0.8,
    transparent: true,
    alphaToCoverage: false,  //启用 alpha 覆盖。 只能与启用 MSAA 的上下文一起使用（意味着在创建渲染器时将抗锯齿参数 antialias 设置为 true）。 启用此选项将平滑剪裁平面边缘和 alphaTest 剪辑边缘上的锯齿。 默认值为 false。
    blendAlpha: 0.01,
    clipShadows: true,
    polygonOffset: true,
    wireframe: false,    //将几何体渲染为线框。默认值为false（即渲染为平面多边形）。
    wireframeLinecap: 'butt',
    wireframeLinejoin: 'bevel',
    wireframeLinewidth: 5.0,
    map: new THREE.TextureLoader().load( './assets/model/textures/sprite1.png' ),
});

const material_depth = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    displacementScale: 1,
    wireframe: false
});

const material_matcap = new THREE.MeshMatcapMaterial({
    map: new THREE.TextureLoader().load( './assets/model/textures/sprite1.png' ),
    // color: 0x00ffff,
    bumpScale: 0.5,
    flatShading: true
})

const material_normal = new THREE.MeshNormalMaterial({
    flatShading: true,
    displacementScale: 0.5
});

const vertices = [];

for ( let i = 0; i < 10000; i ++ ) {

	const x = THREE.MathUtils.randFloatSpread( 2000 );
	const y = THREE.MathUtils.randFloatSpread( 2000 );
	const z = THREE.MathUtils.randFloatSpread( 2000 );

	vertices.push( x, y, z );

}

const geometry_point = new THREE.BufferGeometry();
geometry_point.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

const material_point = new THREE.PointsMaterial( { color: 0x888888 } );

//MeshLambertMaterial受光照影响
const material_lam = new THREE.MeshLambertMaterial({
    // color: 0xffffff,
    // emissive: 0xff0000, //默认是黑色不可见
    // emissiveIntensity: 0.5,
}); 



//创建网格模型
const mesh = new THREE.Mesh(geometry_box, material_lam);
mesh.position.set(0,0,0);

camera.position.z = 5;
// camera.lookAt(5,5,5)
scene.add(mesh);

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

//点光源：两个参数分别表示光源颜色和光照强度
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.intensity = 100.0;//光照强度
pointLight.position.set(1, 5, 10);//点光源放在x轴上
// scene.add(pointLight); //点光源添加到场景中

//平行光
// 从上方照射的白色平行光，强度为 0.5。
const directionalLight = new THREE.DirectionalLight( 0xff0000, 1);
//灯光将投射阴影
directionalLight.castShadow = true;
// directionalLight.position.set(5, 10, 5);
// 对比不同入射角，mesh表面对光照的反射效果
// directionalLight.position.set(100, 0, 0);
// directionalLight.position.set(0, 100, 0);
// directionalLight.position.set(100, 100, 100);
directionalLight.position.set(100, 60, 50);
//directionalLight.target默认指向坐标原点

directionalLight.target = mesh;
scene.add(directionalLight.target);
scene.add( directionalLight );


//半球光
const hemLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( hemLight );
//聚光灯
const spotLight = new THREE.SpotLight( 0xffffff, 1 );
spotLight.position.set( 10, 10, 10 );
// scene.add( spotLight );


// DirectionalLightHelper：可视化平行光
const dirLightHelper = new THREE.DirectionalLightHelper(spotLight, 5,0xff0000);
scene.add(dirLightHelper);


renderer.render(scene, camera);
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 允许阻尼效果
controls.dampingFactor = 0.25; // 阻尼系数

// 渲染循环
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const spt = clock.getDelta()*1000;//毫秒
    // console.log('两帧渲染时间间隔(毫秒)',spt);
    // console.log('帧率FPS',1000/spt);
    mesh.rotation.y+=0.01;
    // mesh.rotation.x+=0.1;
    controls.update();

    renderer.render(scene, camera);
}

animate();

// onresize 事件会在窗口被调整大小时发生（自适应）
window.onresize = function () {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
};

