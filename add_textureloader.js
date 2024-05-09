//主要学习gui相关
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0x00ffff, transparent: true });
camera.position.z = 5;
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const geometry_circle = new THREE.CircleGeometry(4, 32);
let mesh_circle = new THREE.Mesh(geometry_circle, material);
scene.add(mesh_circle);


//纹理贴图
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load('./assets/model/textures/water.jpg');
material.map = texture;

// 设置阵列模式
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
texture.repeat.set(12,12);//注意选择合适的阵列数量

// 旋转矩形平面
mesh_circle.rotateX(-Math.PI/2);
mesh_circle.position.y = -1;

const light = new THREE.AmbientLight(0xffffff,1);
light.position.set(10, 10, 10);
scene.add(light);

// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
scene.add(gridHelper);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 允许阻尼效果
controls.dampingFactor = 0.25; // 阻尼系数

function animate() {
    texture.offset.x +=0.01;//设置纹理动画：偏移量根据纹理和动画需要，设置合适的值
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
