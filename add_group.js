//主要学习gui相关
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
camera.position.z = 5;
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//可视化mesh的局部坐标系
const meshAxesHelper = new THREE.AxesHelper(50);
mesh.add(meshAxesHelper);

let group = new THREE.Group();
for(let i = 0; i < 10; i++) {
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 2;
    mesh.name = "a";
    group.add(mesh);
}
scene.add(group);

//遍历group
group.traverse((obj) => {
    // console.log(obj);
})
// console.log("a",group.getObjectByName("a"));

//长方体的几何中心默认与本地坐标原点重合
const geometry1 = new THREE.BoxGeometry(50, 50, 50);
// 平移几何体的顶点坐标,改变几何体自身相对局部坐标原点的位置
geometry1.translate(50/2,0,0,);
let mesh1 = new THREE.Mesh(geometry1, material);
scene.add(mesh1);
// .rotateY()默认绕几何体中心旋转，经过上面几何体平移变化，你会发现.rotateY()是绕长方体面上一条线旋转
mesh1.rotateY(Math.PI/1);
mesh1.visible = false;


const light = new THREE.AmbientLight(0xffffff,1);
light.position.set(10, 10, 10);
scene.add(light);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 允许阻尼效果
controls.dampingFactor = 0.25; // 阻尼系数


function animate() {
    // group.rotation.y += 0.1;
    // mesh1.rotateY(0.01)
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();



