export default class Camera {
  constructor(gl) {
    // Posição da camera
    this.eye = vec3.fromValues(20.0, 2.0, 20.0);
    this.at  = vec3.fromValues(0.0, 0.0, 0.0);
    this.up  = vec3.fromValues(0.0, 0.5, 0.0);

    this.newX = 20;
    this.newZ = 20;
    this.side = 0;

    // Parâmetros da projeção
    this.fovy = Math.PI / 2;
    this.aspect = gl.canvas.width / gl.canvas.height;

    this.left = -15.5;
    this.right = 15.5;
    this.top = 15.5;
    this.bottom = -15.5;

    this.near = 20;
    this.far = 0;

    // Matrizes View e Projection
    this.view = mat4.create();
    this.proj = mat4.create();
  }

  getView() {
    return this.view;
  }

  getProj() {
    return this.proj;
  }

  updateViewMatrix() {
    mat4.identity( this.view );
    mat4.lookAt(this.view, this.eye, this.at, this.up);

    // Movimentação da câmera parada para n explodir o pc
    if (this.side == 0){
      this.newX -= 0.2;
      this.newZ = Math.sqrt(20 * 20 - this.newX * this.newX);
      if (this.newX <= -20){
        this.side = 1;
      }
    }
    else if (this.side == 1){
      this.newX += 0.2;
      this.newZ = -(Math.sqrt(20 * 20 - this.newX * this.newX));
      if (this.newX >= 20){
        this.side = 0;
      }
    }
    this.eye = vec3.fromValues(this.newX, 2.0, this.newZ);
    
   
  }

  updateProjectionMatrix(type) {
    mat4.identity( this.proj );

    if (type) {
      mat4.ortho(this.proj, this.left * 1024/768, this.right * 1024/768, this.bottom , this.top, this.near, this.far);
    } else {
      mat4.perspective(this.proj, this.fovy, this.aspect, this.near, this.far);
    }
  }

  updateCam(type) {
    this.updateViewMatrix();
    this.updateProjectionMatrix(type);
  }
}