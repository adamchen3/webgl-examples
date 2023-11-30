import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-triangle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './triangle.component.html',
  styleUrl: './triangle.component.scss'
})
export class TriangleComponent implements AfterViewInit {

  private gl!: WebGL2RenderingContext;
  private canvas!: HTMLCanvasElement;
  private shaderProgram!: WebGLProgram;
  private vertexPositionAttribute!: number;
  private vertexBuffer!: WebGLBuffer;

  ngAfterViewInit(): void {
    const canvas = document.getElementById("gl-triangle") as HTMLCanvasElement;
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2') as WebGL2RenderingContext;

    if (!this.gl) {
      throw new Error("WebGL2 Not Support");
    }

    this.setupShaders();
    this.setupBuffers();
    this.draw();
  }

  private setupBuffers() {
    this.vertexBuffer = this.gl.createBuffer() as WebGLBuffer;
    if (!this.vertexBuffer) {
      throw new Error("Create Buffer Failed!");
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    const triangleVertices = [
      0.0, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW);
  }

  private setupShaders() {
    const vertexShaderSource = `
    attribute vec3 aVertexPosition;
    void main() {
      gl_Position = vec4(aVertexPosition, 1.0);
    }
    `;

    const fragmentShaderSource = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    `;

    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    const shaderProgram = this.shaderProgram = this.gl.createProgram() as WebGLProgram;

    if (!shaderProgram) {
      throw new Error("Create Program Failed!");
    }
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error("Link Program Failed!");
    }

    this.gl.useProgram(shaderProgram);

    this.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");
  }

  private loadShader(type: number, shaderSource: string) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Cant not create shader");
    }
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error("Compile Shader Failed");
    }

    return shader;
  }

  private draw() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }

}
