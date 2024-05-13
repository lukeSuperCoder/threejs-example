//主要学习gui相关
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
camera.position.z = 5;
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const arc = new THREE.EllipseCurve(0,0,10,5);
const geometry_circle = new THREE.BufferGeometry({});


// 二维向量Vector2创建一组顶点坐标
// const arr = [
//     new THREE.Vector2(-100, 0),
//     new THREE.Vector2(0, 30),
//     new THREE.Vector2(100, 0),
// ];
// // 二维样条曲线
// const curve = new THREE.SplineCurve(arr);

// 三维向量Vector3创建一组顶点坐标
const arr = [
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(70, 0, 80)
]
// 三维样条曲线
const curve = new THREE.CatmullRomCurve3(arr);

//贝塞尔曲线
// p1、p2、p3表示三个点坐标
// p1、p3是曲线起始点，p2是曲线的控制点
// const p1 = new THREE.Vector2(-80, 0);
// const p2 = new THREE.Vector2(20, 100);
// const p3 = new THREE.Vector2(80, 0);

// p1、p2、p3表示三个点坐标
// const p1 = new THREE.Vector3(-80, 0, 0);
// const p2 = new THREE.Vector3(20, 100, 0);
// const p3 = new THREE.Vector3(80, 0, 100);

// p1、p2、p3、p4表示4个点坐标
// p1、p4是曲线起始点，p2、p3是曲线的控制点
const p1 = new THREE.Vector2(-80, 0);
const p2 = new THREE.Vector2(-40, 50);
const p3 = new THREE.Vector2(50, 50);
const p4 = new THREE.Vector2(80, 0);


// 贝赛尔曲线
const curve_bezier = new THREE.CubicBezierCurve3(p1, p2, p3, p4);

const geometry_line = new THREE.BufferGeometry().setFromPoints([p1,p2,p3,p4]);
geometry_circle.setFromPoints(curve_bezier.getPoints(1000));
const material2 = new THREE.PointsMaterial({
    color: 0xff00ff,
    size: 0.1,
});
let mesh1 = new THREE.Line(geometry_circle, material2);
let mesh2 = new THREE.Points(geometry_circle, material2);
let mesh3 = new THREE.Line(geometry_line, material2);
scene.add(mesh1);
scene.add(mesh2);
scene.add(mesh3);

//三维样条曲线CatmullRomCurve3实现飞线轨迹
// p1、p3轨迹线起始点坐标
const pp1 = new THREE.Vector3(-100, 0, -100);
const pp3 = new THREE.Vector3(100, 0, 100);
// 计算p1和p3的中点坐标
const x2 = (pp1.x + pp3.x)/2;
const z2 = (pp1.z + pp3.z)/2;
const h = 50;
const pp2 = new THREE.Vector3(x2, h, z2);

const parr = [pp1, pp2, pp3];
// 三维样条曲线
const pcurve = new THREE.CatmullRomCurve3(parr);

geometry_circle.setFromPoints(pcurve.getPoints(1000));
let pmesh1 = new THREE.Line(geometry_circle, material);
scene.add(pmesh1);

// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
scene.add(gridHelper);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 允许阻尼效果
controls.dampingFactor = 0.25; // 阻尼系数

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
