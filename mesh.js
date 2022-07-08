import vertShaderSrc from './phong.vert.js';
import fragShaderSrc from './phong.frag.js';

import Shader from './shader.js';
import { HalfEdgeDS } from './half-edge.js';

export default class Mesh {
  constructor(delta) {
    // model data structure
    this.heds = new HalfEdgeDS();

    // Matriz de modelagem
    this.angle = 5;
    this.delta = delta;
    this.model = mat4.create();

    // Shader program
    this.vertShd = null;
    this.fragShd = null;
    this.program = null;

    // Data location
    this.vaoLoc = -1;
    this.indicesLoc = -1;

    this.uModelLoc = -1;
    this.uViewLoc = -1;
    this.uProjectionLoc = -1;
  }

  async loadMeshV4() {
    const resp = await fetch('bunny.obj');
    const text = await resp.text();

    const txtList = text.split(/\s+/);

    const coords = [];
    const norm = [];
    const indices = [];

    for (let did = 0; did < txtList.length; did = did  +4){
      if (txtList[did] == "v"){
        coords.push(Number(txtList[did + 1]));
        coords.push(Number(txtList[did + 2]));
        coords.push(Number(txtList[did + 3]));
      }

      else if (txtList[did] == "vn"){
        norm.push(Number(txtList[did + 1]));
        norm.push(Number(txtList[did + 2]));
        norm.push(Number(txtList[did + 3]));
      }

      else if(txtList[did] == "f"){
        indices.push(Number(txtList[did + 1].split("/")[0]));
        indices.push(Number(txtList[did + 2].split("/")[0]));
        indices.push(Number(txtList[did + 3].split("/")[0]));
      }
    }

    // troca do último valor muda o resultado da função estrela do coelho
    this.heds.build(coords, norm, indices, 10);
  }

  async loadMeshV5() {
    const resp = await fetch('armadillo.obj');
    const text = await resp.text();

    const txtList = text.split(/\s+/);

    const coords = [];
    const norm = [];
    const indices = [];

    for (let did = 0; did < txtList.length; did = did  +4){
      if (txtList[did] == "v"){
        coords.push(Number(txtList[did + 1]));
        coords.push(Number(txtList[did + 2]));
        coords.push(Number(txtList[did + 3]));
      }

      else if (txtList[did] == "vn"){
        norm.push(Number(txtList[did + 1]));
        norm.push(Number(txtList[did + 2]));
        norm.push(Number(txtList[did + 3]));
      }

      else if(txtList[did] == "f"){
        indices.push(Number(txtList[did + 1].split("/")[0]));
        indices.push(Number(txtList[did + 2].split("/")[0]));
        indices.push(Number(txtList[did + 3].split("/")[0]));
      }
    }

    // troca do último valor muda o resultado da função estrela do tatu
    this.heds.build(coords, norm, indices, 10);
  }

  createShader(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.uModelLoc = gl.getUniformLocation(this.program, "u_model");
    this.uViewLoc = gl.getUniformLocation(this.program, "u_view");
    this.uProjectionLoc = gl.getUniformLocation(this.program, "u_projection");
  }

  createVAO(gl) {
    const vbos = this.heds.getVBOs();

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    const coordsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[0]));

    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");
    const colorsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[1]));

    var normalsAttributeLocation = gl.getAttribLocation(this.program, "normal");
    const normalsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[2]));

    this.vaoLoc = Shader.createVAO(gl,
      coordsAttributeLocation, coordsBuffer, 
      colorsAttributeLocation, colorsBuffer, 
      normalsAttributeLocation, normalsBuffer);

    this.indicesLoc = Shader.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(vbos[3]));
  }  

  init(gl, lightBunny, lightArmadillo) {
    this.createShader(gl);
    this.createUniforms(gl);
    this.createVAO(gl);

    //lightBunny.createUniforms(gl, this.program);
    lightArmadillo.createUniforms(gl, this.program);
    lightBunny.createUniforms2(gl, this.program);
  }

  updateModelMatrix() {

    mat4.identity( this.model );
    mat4.translate(this.model, this.model, [this.delta, 0, 0]);
    // [1 0 0 delta, 0 1 0 0, 0 0 1 0, 0 0 0 1] * this.mat 

    mat4.rotateY(this.model, this.model, this.angle);
    // [ cos(this.angle) 0 -sin(this.angle) 0, 
    //         0         1        0         0, 
    //   sin(this.angle) 0  cos(this.angle) 0, 
    //         0         0        0         1]
    // * this.mat 

    mat4.scale(this.model, this.model, [5, 5, 5]);
    // [5 0 0 0, 0 5 0 0, 0 0 5 0, 0 0 0 1] * this.mat 
  }

  draw(gl, cam) {
    // faces orientadas no sentido anti-horário
    gl.frontFace(gl.CCW);

    // face culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(this.program);

    // updates the model transformations
    this.updateModelMatrix();

    const model = this.model;
    const view = cam.getView();
    const proj = cam.getProj();
    
    gl.uniformMatrix4fv(this.uModelLoc, false, model);
    gl.uniformMatrix4fv(this.uViewLoc, false, view);
    gl.uniformMatrix4fv(this.uProjectionLoc, false, proj);

    gl.bindVertexArray(this.vaoLoc);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesLoc);

    gl.drawElements(gl.TRIANGLES, this.heds.faces.length * 3, gl.UNSIGNED_INT, 0);

    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
  }
}