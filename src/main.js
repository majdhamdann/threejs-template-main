import "./style.css";
import GUI from "lil-gui";
import {
    AmbientLight,
    BoxGeometry,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    SphereGeometry,
    WebGLRenderer,
    Object3D,
    Vector3
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//GUI
const gui = new GUI();

const param = {
    myString: "lil-gui",
    m: 70,
    h: 0,
    A: true,
    windSpeed: 0,
    descentAngle: 0,
};
gui.add(param, "myString"); // Text Field
gui.add(param, "m");
gui.add(param, "h", 0, 3000);
gui.add(param, "A");
gui.add(param, "windSpeed");
gui.add(param, "descentAngle", 0, 90);


class Physic {
constructor(){
    this.rho0 = 1.225;
    this. g = 9.8;
    this.dt = 0.01;

    this.a=20;
    this.b=30;
    
    this.x = -1; // ?????? x
    this.y = -50; // ?????? y
    this.z = 0; // ?????? z ???? ?? ???? ????? ???????? h ??????
    
    this.vx=0;
    this.vy=0;
    this.vz=0;

    this.ax=0;
    this.ay=0;
    this.az=0;


    this.fx=0;
    this.fy=0;
    this.fz=0;
    
    this.m = param.m;
    this.A = 0.5;
    this.Cr = 0.3;
    this.Cl = 0.3;
    
    this.airplaneVx = 80;
    this.airplaneVy = 0;
    this.airplaneVz = 0;
    
    this.airplaneX = -100;
    this.airplaneY = 300;
    this.airplaneZ = 80;
    
}

jump(){
this.x=this.airplaneX;
this.y=this.airplaneY;
this.z=this.airplaneZ;

this.vx= this.airplaneVx;
this.vy= this.airplaneVy;
this.vz= this.airplaneVz;
paraModel.visible=false;

}

openPara(){
    this.A = 50;
    this.Cr = 2;
    this.Cl = 1;
    paraModel.visible=true;
}

PhysicUpdate(){

    this.fx =0;
    this.fy =0;
    this.fz =0;

this.addFly();
this.addWeight();
this.addR();
this.addLift();

    this.ax =this.fx/this.m;
    this.ay =this.fy/this.m;
    this.az =this.fz/this.m;

   this.vx+=this.ax*this.dt;
   this.vy+=this.ay*this.dt;
   this.vz+=this.az*this.dt;
   
    this. x+=this.vx*this.dt;
   this. y+=this.vy*this.dt;
   this. z+=this.vz*this.dt;
   

}


addFly(){
    this. airplaneX+=this.airplaneVx*this.dt;
   this. airplaneY+=this.airplaneVy*this.dt;
   this. airplaneZ+=this.airplaneVz*this.dt;
}

addWeight(){
    this.fy -= 9.8*this.m;
}

addR(){
    this.rho = this.rho0 * Math.exp(-this.y / 10000);
    var rx= 0.5*this.rho *this.A*this.vx*this.vx;
    var ry= 0.5*this.rho *this.A*this.vy*this.vy;
    var rz= 0.5*this.rho *this.A*this.vz*this.vz;

    if (this.vx<0){
        this.fx += rx;
    }else{
        this.fx-= rx;
    };
    if (this.vy<0){
        this.fy += ry;
    }else{
        this.fy-= ry;
    };
    if (this.vz<0){
        this.fz += rz;
    }else{
        this.fz-= rz;
    }

}
addLift(){
    this.rho = this.rho0 * Math.exp(-this.y / 10000);
    var fliftx= -0.5*this.rho *this.A*this.vx*this.vx *Math.cos(this.a);
    var flifty= -0.5*this.rho *this.A*this.vy*this.vy *Math.sin(this.b);
    var fliftz= -0.5*this.rho *this.A*this.vz*this.vz *Math.sin(this.a)*Math.sin(this.b);
    if (this.vx<0){
        this.fx += fliftx;
    }else{
        this.fx-= fliftx;
    };
    if (this.vy<0){
        this.fy += flifty;
    }else{
        this.fy-= flifty;
    };
    if (this.vz<0){
        this.fz += fliftz;
    }else{
        this.fz-= fliftz;
    }

}

};

let ph= new Physic();
/* DOM access */
const canvas = document.getElementById("scene");

/* Global Constants */
const scene = new Scene();
const camera = new PerspectiveCamera(
    50,
    canvas.width / canvas.height,
    2,
    10000,
);
const renderer = new WebGLRenderer({
    canvas,
});
const controls = new OrbitControls(camera, canvas);

const onKeyDown = function (event) {
    switch (event.key) {
      case "o":
        ph.openPara();
        break;
        case "j":
        ph.jump();
        break;


    }
  };
  document.addEventListener('keydown', onKeyDown);



/* Lighting */
const light = new AmbientLight(0x404040, 10); // soft white light
scene.add(light);



/*Moudels */


const loader = new GLTFLoader();
loader.load(
    "model/sky_dome_demo.glb",
    function (gltf) {
        const sky = gltf.scene;
        scene.add(gltf.scene);
        sky.scale.set(50, 50, 50);
        sky.position.y = 3;
    },
    undefined,
    function (error) {
        console.error(error);
    },
);

let manModel;

var man = new GLTFLoader();
man.load(
    "model/cool_man.glb",
    function (gltf) {
        var man1 =  gltf.scene ;
        man1.scale.set(10,10,10);

        scene.add(gltf.scene);
    
        manModel = man1;
    
    },
    function (error) {
        console.error(error);
    },
);


var uuu = new Vector3(1,2,3);

let backModel;
const back = new GLTFLoader();

back.load(
    "model/dengshanbao.glb",
    function (gltf) {
        const back1 = gltf.scene;
        back1.scale.set(3.5, 3.5, 3.5);
        back1.rotateY(3);
        scene.add(gltf.scene);
        backModel=back1;
    },
    undefined,
    function (error) {
        console.error(error);
    },
);

let paraModel;

const para = new GLTFLoader();

para.load(
    "model/para.glb",
    function (gltf) {
        scene.add(gltf.scene);
        const para1 = gltf.scene;
        para1.scale.set(2, 2, 2);
        paraModel=para1;
    },
    undefined,
    function (error) {
        console.error(error);
    },
);
let helicopterModel; 
const Helicopter = new GLTFLoader();

Helicopter.load(
    "model/Helicopter.glb",
    function (gltf) {
        scene.add(gltf.scene);
        const Helicopter1 = gltf.scene;
        Helicopter1.scale.set(6, 6, 6);
        helicopterModel=Helicopter1;
    },
    undefined,
    function (error) {
        console.error(error);
    },
);

/* Functions */
const handleWindowResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();

    controls.update();
};

const init = () => {
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    //back.rotateY(180);
    camera.position.set(-600, 500, 0);

    controls.update();

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);

};



const update = (delta) => {
    ph.PhysicUpdate();
manModel.position.set(ph.x,ph.y,ph.z);
paraModel.position.set(ph.x,ph.y-7,ph.z);
backModel.position.set(ph.x,ph.y+8,ph.z);
helicopterModel.position.set(ph.airplaneX,ph.airplaneY,ph.airplaneZ);
};

const render = () => {
    controls.update();
    renderer.render(scene, camera);
};

export const main = () => {
    let lastTime = new Date().getTime();

    const loop = () => {
        window.requestAnimationFrame(loop);
        const currentTime = new Date().getTime();
        const delta = currentTime - lastTime;
        lastTime = currentTime;

        update(delta);

        // ???? ????? ?????????? ???

        render();
    };

    init();
    loop();
};

/* Main program (function calls) */
main();
