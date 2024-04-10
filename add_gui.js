//主要学习gui相关
import * as THREE from 'three';
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// 实例化一个gui对象
const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = '0px';
gui.domElement.style.width = '300px';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// cube.scale.z  = 2;
scene.add(cube);

const light = new THREE.AmbientLight(0xffffff,1);
light.position.set(100, 100, 100);
scene.add(light);

const option = {
    z: 5,
    x: 0,
    y: 0,
    color: '#ffffff',
    intensity: 1,
    size: 1,
    opacity: 1,
    visible: true,
    wireframe: false,
    transparent: true,
    rotation: 0,
    scale: 1,
    speed: 1,
    animate: false,
    animateType: 'rotation',
    animateDirection: 'clockwise',
}

//gui控制参数
const folder_position = gui.addFolder('位置');
folder_position.add(option, 'z', 0, 100);
folder_position.add(option, 'x', 0, 100).onChange((val) => {
    cube.position.x = val;
});
folder_position.add(option, 'y', 0, 100);

const folder_env = gui.addFolder('环境');
folder_env.add(option, 'intensity', 0, 1000).name('光强').step(0.1);
folder_env.addColor(option, 'color').name('颜色');
//数组类型： 下拉菜单
const obj = {
    scale: 0,
};
// 创建材质子菜单
const matFolder = gui.addFolder('材质');
matFolder.close();
const matFolder_c = matFolder.addFolder('位置')
//数据类型：数组(下拉菜单)
matFolder.add(obj, 'scale', [-100, 0, 100]).name('y坐标').onChange(function (value) {
    cube.position.y = value;
});
//数据类型：对象,生成交互界面是下拉菜单
const obj1 = {
    scale: 0,
};
// 参数3数据类型：对象(下拉菜单)
matFolder_c.add(obj1, 'scale', {
    left: -100,
    center: 0,
    right: 100
    // 左: -100,//可以用中文
    // 中: 0,
    // 右: 100
}).name('位置选择').onChange(function (value) {
    cube.position.x = value;
});

//数据类型：布尔值   单选框
const obj2 = {
    bool: false,
};
// 改变的obj属性数据类型是布尔值，交互界面是单选框
gui.add(obj2, 'bool').name('是否旋转');



function animate() {
    // 当gui界面设置obj.bool为true,mesh执行旋转动画
    if (obj2.bool) cube.rotateY(0.01);

    camera.position.z = option.z;
    // camera.position.x = option.x;
    camera.position.y = option.y;
    light.intensity = option.intensity;
    cube.material.color.set(option.color);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

