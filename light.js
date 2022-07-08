export default class Light {
  constructor(pos_x, pos_y, pos_z, dif_x, dif_y, dif_z) {
    this.pos = vec4.fromValues(pos_x, pos_y, pos_z, 1.0);

    this.amb_c = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.amb_k = 0.2;

    this.dif_c = vec4.fromValues(dif_x, dif_y, dif_z, 1.0);
    this.dif_k = 10;

    this.esp_c = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.esp_k = 0.4;
    this.esp_p = 5.0;
  }

  createUniforms(gl, program){
    const posLoc = gl.getUniformLocation(program, "light_pos1");
    gl.uniform4fv(posLoc, this.pos);

    const ambCLoc = gl.getUniformLocation(program, "light_amb_c");
    gl.uniform4fv(ambCLoc, this.amb_c);
    const ambKLoc = gl.getUniformLocation(program, "light_amb_k");
    gl.uniform1f(ambKLoc, this.amb_k);

    const difCLoc = gl.getUniformLocation(program, "light_dif_c1");
    gl.uniform4fv(difCLoc, this.dif_c);
    const difKLoc = gl.getUniformLocation(program, "light_dif_k");
    gl.uniform1f(difKLoc, this.dif_k);

    const espCLoc = gl.getUniformLocation(program, "light_esp_c");
    gl.uniform4fv(espCLoc, this.pos);
    const espKLoc = gl.getUniformLocation(program, "light_esp_k");
    gl.uniform1f(espKLoc, this.esp_k);
    const espPLoc = gl.getUniformLocation(program, "light_esp_p");
    gl.uniform1f(espPLoc, this.esp_p);
  }

  createUniforms2(gl, program){
    const posLoc = gl.getUniformLocation(program, "light_pos2");
    gl.uniform4fv(posLoc, this.pos);

    const ambCLoc = gl.getUniformLocation(program, "light_amb_c");
    gl.uniform4fv(ambCLoc, this.amb_c);
    const ambKLoc = gl.getUniformLocation(program, "light_amb_k");
    gl.uniform1f(ambKLoc, this.amb_k);

    const difCLoc = gl.getUniformLocation(program, "light_dif_c2");
    gl.uniform4fv(difCLoc, this.dif_c);
    const difKLoc = gl.getUniformLocation(program, "light_dif_k");
    gl.uniform1f(difKLoc, this.dif_k);

    const espCLoc = gl.getUniformLocation(program, "light_esp_c");
    gl.uniform4fv(espCLoc, this.pos);
    const espKLoc = gl.getUniformLocation(program, "light_esp_k");
    gl.uniform1f(espKLoc, this.esp_k);
    const espPLoc = gl.getUniformLocation(program, "light_esp_p");
    gl.uniform1f(espPLoc, this.esp_p);
  }

  updateLight() {
    // TODO: Change light position
  }
}