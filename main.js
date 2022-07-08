import Camera from './camera.js';
import Light from './light.js';
import Mesh from './mesh.js';

class Scene {
  constructor(gl) {
    // Camera virtual
    this.cam = new Camera(gl);

    // Luz
    this.lightBunny = new Light(20, 0, 0, 0, 0, 1);
    this.lightArmadillo = new Light(-20, 0, 0, 0, 1, 0);

    // Mesh
    this.mesh = new Mesh( 10);
    this.copy = new Mesh(-10);
  }

  async init(gl) {

    await this.mesh.loadMeshV4();
    this.mesh.init(gl, this.lightBunny, this.lightArmadillo);

    await this.copy.loadMeshV5();
    this.copy.init(gl, this.lightBunny, this.lightArmadillo);
  }

  draw(gl, type) {
    this.cam.updateCam(type);

    this.mesh.draw(gl, this.cam, this.lightBunny, this.lightArmadillo);
    this.copy.draw(gl, this.cam, this.lightBunny, this.lightArmadillo);
  }
}

class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");

    this.gl = canvas.getContext("webgl2");
    this.setViewport();

    this.scene = new Scene(this.gl);
    this.scene.init(this.gl).then(() => {
      this.draw();
    });
  }

  setViewport() {
    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  draw() {
    const bodyElement = document.querySelector( "body" );

	  bodyElement.addEventListener( 'keyup', keyDown);
    function keyDown( event ){
      
      if ("p" == event.key){
        if (controller1 == true){
          if (type){
            type = false;
          }
          else{
            type = true;
          }
        }
        controller1 = false;
        controller2 = false;
      }
    }
    if (controller2 == true){
      controller1 = true;
    }
    if (controller2 == false){
      controller2 = true;
    }

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl, type);

    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  const app = new Main();
  app.draw();
}

// variáveis para controle do modo de visão
var type = false;
var controller1 = true;
var controller2 = true;
