import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { BoxGeometry, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-transform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transform.component.html',
  styleUrl: './transform.component.scss'
})
export class TransformComponent implements AfterViewInit, OnDestroy {

  private count = 0;
  private handleNumber = -1;

  ngOnDestroy(): void {
    cancelAnimationFrame(this.handleNumber)
  }


  ngAfterViewInit(): void {
    const canvas = document.querySelector("#webgl-transform") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      return;
    }

    const vertexShaderCode = `
      attribute vec3 aVertexPosition;
      attribute vec4 aVertextColor;
      varying vec4 vColor;

      uniform mat4 uWorldTransform;   // 仅仅在这里声明，WebGL是找不到这个变量的位置的，需要在程序（main）中使用才行。
      uniform mat4 uViewTransform;
      uniform mat4 uProjectionTransform;

      void main() {
        gl_Position = uProjectionTransform * (uViewTransform * (uWorldTransform * vec4(aVertexPosition, 1.0)));
        vColor = aVertextColor;
      }
    `;

    const fragmentShaderCode = `
      precision mediump float;

      varying vec4 vColor;

      void main() {
        gl_FragColor = vColor;
      }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
      return;
    }
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      return;
    }
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      return;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const camera = new PerspectiveCamera(65, canvas.width / canvas.height, 0.1, 100);
    camera.position.set(7, 7, 12);
    camera.lookAt(new Vector3());
    camera.updateWorldMatrix(false, false);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    const colorAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertextColor");

    const positionWorldUniformLocation = gl.getUniformLocation(shaderProgram, "uWorldTransform");
    const positionViewUniformLocation = gl.getUniformLocation(shaderProgram, "uViewTransform");
    const positionProjectionUnfiormLocation = gl.getUniformLocation(shaderProgram, "uProjectionTransform");

    const render = () => {
      gl.clearColor(0.1, 0.7, 0.3, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      const floorVertices = [
        -5.0, 0.0, -5.0,
        -5.0, 0.0, 5.0,
        5.0, 0.0, -5.0,
        5.0, 0.0, 5.0
      ];

      const floorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, floorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floorVertices), gl.STATIC_DRAW);

      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

      gl.disableVertexAttribArray(colorAttributeLocation);
      gl.vertexAttrib4f(colorAttributeLocation, 1.0, 0.0, 0.0, 1.0);

      let worldMatrix = new Matrix4().identity();
      gl.uniformMatrix4fv(positionWorldUniformLocation, false, worldMatrix.elements);
      const viewMatrix = camera.matrixWorldInverse;
      gl.uniformMatrix4fv(positionViewUniformLocation, false, viewMatrix.elements);
      const projectionMatrix = camera.projectionMatrix;
      gl.uniformMatrix4fv(positionProjectionUnfiormLocation, false, projectionMatrix.elements);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      const cubeVertices = [
        // Front face
        1.0, 1.0, 1.0, //v0
        -1.0, 1.0, 1.0, //v1
        -1.0, -1.0, 1.0, //v2
        1.0, -1.0, 1.0, //v3

        // Back face
        1.0, 1.0, -1.0, //v4
        -1.0, 1.0, -1.0, //v5
        -1.0, -1.0, -1.0, //v6
        1.0, -1.0, -1.0, //v7

        // Left face
        -1.0, 1.0, 1.0, //v8
        -1.0, 1.0, -1.0, //v9
        -1.0, -1.0, -1.0, //v10
        -1.0, -1.0, 1.0, //v11

        // Right face
        1.0, 1.0, 1.0, //12
        1.0, -1.0, 1.0, //13
        1.0, -1.0, -1.0, //14
        1.0, 1.0, -1.0, //15

        // Top face
        1.0, 1.0, 1.0, //v16
        1.0, 1.0, -1.0, //v17
        -1.0, 1.0, -1.0, //v18
        -1.0, 1.0, 1.0, //v19

        // Bottom face
        1.0, -1.0, 1.0, //v20
        1.0, -1.0, -1.0, //v21
        -1.0, -1.0, -1.0, //v22
        -1.0, -1.0, 1.0, //v23
      ];

      const cubeIndices = [
        0, 1, 2, 0, 2, 3, // Front face
        4, 6, 5, 4, 7, 6, // Back face
        8, 9, 10, 8, 10, 11, // Left face
        12, 13, 14, 12, 14, 15, // Right face
        16, 17, 18, 16, 18, 19, // Top face
        20, 22, 21, 20, 23, 22 // Bottom face
      ];

      const cubeBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

      const cubeIndicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

      // 桌脚
      gl.disableVertexAttribArray(colorAttributeLocation);
      gl.vertexAttrib4f(colorAttributeLocation, 0.0, 1.0, 0.0, 1.0);
      // gl.vertexAttrib4f(colorAttributeLocation, 164 / 255, 116 / 255, 73 / 255, 1.0);

      worldMatrix = new Matrix4().makeScale(0.1, 1, 0.1).setPosition(1.9, 1, 1.9);
      gl.uniformMatrix4fv(positionWorldUniformLocation, false, worldMatrix.elements);
      gl.drawElements(gl.TRIANGLE_STRIP, 36, gl.UNSIGNED_SHORT, 0);

      worldMatrix = new Matrix4().makeScale(0.1, 1, 0.1).setPosition(1.9, 1, -1.9);
      gl.uniformMatrix4fv(positionWorldUniformLocation, false, worldMatrix.elements);
      gl.drawElements(gl.TRIANGLE_STRIP, 36, gl.UNSIGNED_SHORT, 0);

      worldMatrix = new Matrix4().makeScale(0.1, 1, 0.1).setPosition(-1.9, 1, 1.9);
      gl.uniformMatrix4fv(positionWorldUniformLocation, false, worldMatrix.elements);
      gl.drawElements(gl.TRIANGLE_STRIP, 36, gl.UNSIGNED_SHORT, 0);

      worldMatrix = new Matrix4().makeScale(0.1, 1, 0.1).setPosition(-1.9, 1, -1.9);
      gl.uniformMatrix4fv(positionWorldUniformLocation, false, worldMatrix.elements);
      gl.drawElements(gl.TRIANGLE_STRIP, 36, gl.UNSIGNED_SHORT, 0);

      // 桌面
      gl.disableVertexAttribArray(colorAttributeLocation);
      gl.vertexAttrib4f(colorAttributeLocation, 164 / 255, 116 / 255, 73 / 255, 1.0);

      worldMatrix = new Matrix4().makeScale(2, 0.1, 2).setPosition(0, 2.1, 0);
      gl.uniformMatrix4fv(positionWorldUniformLocation, false, worldMatrix.elements);
      gl.drawElements(gl.TRIANGLE_STRIP, 36, gl.UNSIGNED_SHORT, 0);

      // 盒子
      gl.disableVertexAttribArray(colorAttributeLocation);
      gl.vertexAttrib4f(colorAttributeLocation, 0.0, 0.0, 1.0, 1.0);

      worldMatrix = new Matrix4().makeScale(0.5, 0.5, 0.5).setPosition(new Vector3(0, 2.7, 0));
      gl.uniformMatrix4fv(positionWorldUniformLocation, false, worldMatrix.elements);
      gl.drawElements(gl.TRIANGLE_STRIP, 36, gl.UNSIGNED_SHORT, 0);

      this.handleNumber = requestAnimationFrame(() => {
        console.log(this.count++);
        constrols.update();
        render();
      })
    }

    const constrols = new OrbitControls(camera, canvas);
    constrols.update();
    render();

  }

}
