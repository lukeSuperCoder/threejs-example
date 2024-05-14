//主要学习gui相关
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// 引入CSS3渲染器CSS3DRenderer
import {CSS3DRenderer, CSS3DObject} from 'three/addons/renderers/CSS3DRenderer.js';


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

//html标签展示
const div = document.getElementById('tag');
// HTML元素转化为threejs的CSS2模型对象
const tag = new CSS3DObject(div);
console.log(tag);
tag.position.set(0,1,0);
scene.add(tag);
const css2Renderer = new CSS3DRenderer();
// width, height：canvas画布宽高度
css2Renderer.setSize(window.innerWidth, window.innerHeight);
// HTML标签<div id="tag"></div>外面父元素叠加到canvas画布上且重合
css2Renderer.domElement.style.fontSize = '0.5px';
css2Renderer.domElement.style.position = 'absolute';
css2Renderer.domElement.style.top = '0px';
//设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
css2Renderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(css2Renderer.domElement);

// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
scene.add(gridHelper);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 允许阻尼效果
controls.dampingFactor = 0.25; // 阻尼系数
let t = 0;
let R = 100;
let i = 0;
const pointsArr = curve.getPoints(1000);
function animate() {
    // t += 0.01;
    // camera.position.x = R*Math.cos(t);
    // camera.position.z = R*Math.sin(t);
    // camera.lookAt(0,0,0);
    //管道漫游案例
    // if (i < pointsArr.length - 1) {
    //     // 相机位置设置在当前点位置
    //     camera.position.copy(pointsArr[i]);
    //     // 曲线上当前点pointsArr[i]和下一个点pointsArr[i+1]近似模拟当前点曲线切线
    //     // 设置相机观察点为当前点的下一个点，相机视线和当前点曲线切线重合
    //     camera.lookAt(pointsArr[i + 1]);
    //     i += 1; //调节速度
    // } else {
    //     i = 0
    // }
    requestAnimationFrame(animate);
    css2Renderer.render(scene, camera);
    renderer.render(scene, camera);
}
//利用射线 Raycaster实现(鼠标点击选中模型)
renderer.domElement.addEventListener('click', function (event) {
    // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标px、py转WebGL标准设备坐标x、y
    //width、height表示canvas画布宽高度
    const x = (px / window.innerWidth) * 2 - 1;
    const y = -(py / window.innerHeight) * 2 + 1;
    //创建一个射线投射器`Raycaster`
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    //.intersectObjects([mesh1, mesh2, mesh3])对参数中的网格模型对象进行射线交叉计算
    // 未选中对象返回空数组[],选中一个对象，数组1个元素，选中两个对象，数组两个元素
    const intersects = raycaster.intersectObjects([mesh, mesh1, mesh2, mesh3]);
    console.log("射线器返回的对象", intersects);
    // intersects.length大于0说明，说明选中了模型
    if (intersects.length > 0) {
        // 选中模型的第一个模型，设置为红色
        intersects[0].object.material.color.set(0xff0000);
    }
})


animate();
