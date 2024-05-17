//主要学习gui相关
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 引入OutlinePass通道
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

import TWEEN from '@tweenjs/tween.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(3, 0.1, 3);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

camera.position.z = 5;
let mesh = new THREE.Mesh(geometry, material);
mesh.name = 'Box';
scene.add(mesh);

// const light = new THREE.PointLight( 0xffffff, 100 );
// scene.add( light );
const ambient = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambient);

//骨关节
const Bone1 = new THREE.Bone(); //关节1，用来作为根关节
const Bone2 = new THREE.Bone(); //关节2
const Bone3 = new THREE.Bone(); //关节3

// 设置关节父子关系   多个骨头关节构成一个树结构
Bone1.add(Bone2);
Bone2.add(Bone3);

//根关节Bone1默认位置是(0,0,0)
Bone2.position.y = 1; //Bone2相对父对象Bone1位置
Bone3.position.y = 1; //Bone3相对父对象Bone2位置
//平移Bone1，Bone2、Bone3跟着平移
Bone1.position.set(1,0,1);

// 骨骼关节旋转
Bone1.rotateX(Math.PI / 6);
Bone2.rotateX(Math.PI / 6);

// 骨骼关节可以和普通网格模型一样作为其他模型子对象，添加到场景中
const group = new THREE.Group();
group.add(Bone1);

// SkeletonHelper会可视化参数模型对象所包含的所有骨骼关节
const skeletonHelper = new THREE.SkeletonHelper(group);
group.add(skeletonHelper);

scene.add(group);
// 创建后处理对象EffectComposer，WebGL渲染器作为参数
const composer = new EffectComposer(renderer);
// OutlinePass第一个参数v2的尺寸和canvas画布保持一致
const v2 = new THREE.Vector2(window.innerWidth, window.innerHeight);
// const v2 = new THREE.Vector2(800, 600);
const outlinePass = new OutlinePass(v2, scene, camera);

let meshList = [];
let model = null;

//包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
let mixer = null;
//AnimationMixer的`.clipAction()`返回一个AnimationAction对象
let clipAction = null; 

const loader = new GLTFLoader(); 
loader.setPath( './assets/model/gltf/');
loader.load( 'Horse.glb', async function ( gltf ) {
    console.log('控制台查看gltf对象结构', gltf);
    console.log('动画数据', gltf.animations);

    // 骨骼辅助显示
    const skeletonHelper = new THREE.SkeletonHelper(gltf.scene);

    //包含关键帧动画的模型作为参数创建一个播放器
    mixer = new THREE.AnimationMixer(gltf.scene);
    //  获取gltf.animations[0]的第一个clip动画对象
    clipAction = mixer.clipAction(gltf.animations[0]); //创建动画clipAction对象
    clipAction.play(); //播放动画
    clipAction.setEffectiveTimeScale(5);    // 调整动画速度
    console.log('clipAction',clipAction);
    // 递归遍历所有模型节点批量修改材质
    gltf.scene.traverse(function(obj) {
        if (obj.isMesh) {//判断是否是网格模型
            console.log('模型节点',obj);
            console.log('模型节点名字',obj.name);
            // obj.material = new THREE.MeshLambertMaterial({
            //     color:0xffffff,
            // });
            // obj.material.wireframe = true;
            meshList.push(obj);
            outlinePass.selectedObjects[obj];
        }
    });
    model = gltf.scene;
    model.scale.set(0.01,0.01,0.01);
    model.add(skeletonHelper);
    // model.position.x = 0;
    // model.position.y = 0.1;

    await renderer.compileAsync( model, camera, scene );
    
    // // 设置OutlinePass通道
    // composer.addPass(outlinePass);

    scene.add( model );
    render();
})


//创建关键帧动画AnimationClip
const times = [0,3,6];
const values = [0, 0, 0, 10, 0, 0, 0, 0, 10];
// 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
const posKF = new THREE.KeyframeTrack('Box.position', times, values);
// 从2秒到5秒，物体从红色逐渐变化为蓝色
const colorKF = new THREE.KeyframeTrack('Box.material.color', [2,5], [1,0,0,0,0,1]);
// 1.3 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒。
const clip = new THREE.AnimationClip("test", 6, [posKF, colorKF]);


// //包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
// const mixer = new THREE.AnimationMixer(mesh);
// //AnimationMixer的`.clipAction()`返回一个AnimationAction对象
// const clipAction = mixer.clipAction(clip); 
//.play()控制动画播放，默认循环播放
// clipAction.play(); 
//不循环播放，执行一次后默认回到动画开头
// clipAction.loop = THREE.LoopOnce; 
// 物体状态停留在动画结束的时候
// clipAction.clampWhenFinished = true;

// clipAction.paused = false;//切换为播放状态
// clipAction.stop();//动画停止结束，回到开始状态

// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
scene.add(gridHelper);

//tweenjs
// const R = 100; //相机圆周运动的半径
// new TWEEN.Tween({angle:0})
// .to({angle: Math.PI*2}, 16000)
// .onUpdate(function(obj){
//     camera.position.x = R * Math.cos(obj.angle);
//     camera.position.z = R * Math.sin(obj.angle);
//     camera.lookAt(0, 0, 0);
// })
// .start()

camera.position.set(30, 30, 30);
camera.lookAt(0, 0, 0);

// 视觉效果：地球从小到大出现(透视投影相机远小近大投影规律)
new TWEEN.Tween(camera.position)
.to({x: 3,y: 3,z: 3}, 3000)
.start()
.easing(TWEEN.Easing.Sinusoidal.InOut)//进入和结束都设置缓动


var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 允许阻尼效果
controls.dampingFactor = 0.25; // 阻尼系数

const gui = new GUI(); //创建GUI对象
// 0~6倍速之间调节
// gui.add(clipAction, 'timeScale', 0, 6);
//AnimationAction.time把动画定格在时间轴上任何位置
// gui.add(clipAction, 'time', 0, 6).step(0.1);
gui.add(Bone1.rotation, 'x', 0, Math.PI / 3).name('关节1');
gui.add(Bone2.rotation, 'x', 0, Math.PI / 3).name('关节2');

const clock = new THREE.Clock();
function animate() {
    composer.render();
    if(clipAction) {
        //阻尼效果 逐渐减速直到停止
        // clipAction.setEffectiveTimeScale(clipAction.timeScale*0.995);
    }
    TWEEN.update();//tween更新
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    const frameT = clock.getDelta();
    // 更新播放器相关的时间
    mixer.update(frameT);
    camera.lookAt(mesh.position);
    // model.rotateX(0.01);
    const car = meshList.filter(i => i.id===69);
    if(car.length>0) {
        // 当你旋转车轮时，它应该会围绕自己的几何中心旋转
        // car[0].rotateX(0.01); // 旋转代码需要在你的渲染或动画循环中

        //自转360度
        // car[0].rotateX(0.05);
    }
}
function render() {
	renderer.render( scene, camera );

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
    const intersects = raycaster.intersectObjects(meshList);
    console.log("射线器返回的对象", intersects);
    // intersects.length大于0说明，说明选中了模型
    if (intersects.length > 0) {
        // 选中模型的第一个模型，设置为红色
        intersects[0].object.material.color.set(0xff0000);
        const pos = new THREE.Vector3();
        intersects[0].object.getWorldPosition(pos); //获取三维场景中某个对象世界坐标
        // 相机飞行到的位置和观察目标拉开一定的距离
        const pos2 = pos.clone().addScalar(3);
        createCameraTween(pos2, controls.target);
    }
})

// 相机动画函数，从A点飞行到B点，A点表示相机当前所处状态
// pos: 三维向量Vector3，表示动画结束相机位置
// target: 三维向量Vector3，表示相机动画结束lookAt指向的目标观察点
function createCameraTween(endPos,endTarget){
    new TWEEN.Tween({
        // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        tx: controls.target.x,
        ty: controls.target.y,
        tz: controls.target.z,
    })
    .to({
        // 动画结束相机位置坐标
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        // 动画结束相机指向的目标观察点
        tx: endTarget.x,
        ty: endTarget.y,
        tz: endTarget.z,
    }, 2000)
    .onUpdate(function (obj) {
        // 动态改变相机位置
        camera.position.set(obj.x, obj.y, obj.z);
        // camera.position.set(0, 1.6, -2.3);//第三人称
        camera.position.set(0, 1.6, -5);//第一人称
        // 动态计算相机视线
        // camera.lookAt(obj.tx, obj.ty, obj.tz);
        controls.target.set(obj.tx, obj.ty, obj.tz);
        controls.update();//内部会执行.lookAt()
    })
    .start()
    .easing(TWEEN.Easing.Quadratic.Out);//使用二次缓动函数;
}
document.addEventListener('mousemove', (event) => {
    // 注意rotation.y += 与 -= 区别，左右旋转时候方向相反
    //event.movementX缩小一定倍数改变旋转控制的灵敏度
    model.rotation.y -= event.movementX / 600;
});
animate();
