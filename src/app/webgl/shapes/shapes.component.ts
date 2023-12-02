import { AfterViewInit, Component } from '@angular/core';
import { CommonModule, getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-shapes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shapes.component.html',
  styleUrl: './shapes.component.scss'
})
export class ShapesComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const canvas = document.querySelector("#webgl-shapes") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      return;
    }

    gl.clearColor(0.1, 0.7, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ====setup shader======
    const vertexShaderCode = `
      attribute vec3 aVertexPosition;
      attribute vec4 aVertextColor;
      varying vec4 vColor;

      void main() {
        vColor = aVertextColor;
        gl_Position = vec4(aVertexPosition, 1.0);
      }
    `

    const fragmentShaderCode = `
      precision mediump float;

      varying vec4 vColor;

      void main() {
        gl_FragColor = vColor;
      }
    `

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

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    const colorAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertextColor");

    const hexagonVertices = [
      -0.3, 0.6, 0.0,
      -0.4, 0.8, 0.0,
      -0.6, 0.8, 0.0,
      -0.7, 0.6, 0.0,
      -0.6, 0.4, 0.0,
      -0.4, 0.4, 0.0,
      -0.3, 0.6, 0.0
    ];

    const hexagonBuffer = gl.createBuffer();
    if (!hexagonBuffer) {
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.disableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttrib4f(colorAttributeLocation, 0.0, 0.0, 0.0, 1.0);

    gl.drawArrays(gl.LINE_STRIP, 0, 7);

    const triangleVertices = [
      0.3, 0.4, 0.0,
      0.7, 0.4, 0.0,
      0.5, 0.8, 0.0
    ];

    const triangleColors = [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ];

    const triangleBuffer = gl.createBuffer();
    if (!triangleBuffer) {
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    // gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    const colorBuffer = gl.createBuffer();
    if (!colorBuffer) {
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);


    const stripVertices = [
      -0.5, 0.2, 0.0,
      -0.4, 0.0, 0.0,
      -0.3, 0.2, 0.0,
      -0.2, 0.0, 0.0,
      -0.1, 0.2, 0.0,
      0.0, 0.0, 0.0,
      0.1, 0.2, 0.0,
      0.2, 0.0, 0.0,
      0.3, 0.2, 0.0,
      0.4, 0.0, 0.0,
      0.5, 0.2, 0.0,

      -0.5, -0.3, 0.0,
      -0.4, -0.5, 0.0,
      -0.3, -0.3, 0.0,
      -0.2, -0.5, 0.0,
      -0.1, -0.3, 0.0,
      0.0, -0.5, 0.0,
      0.1, -0.3, 0.0,
      0.2, -0.5, 0.0,
      0.3, -0.3, 0.0,
      0.4, -0.5, 0.0,
      0.5, -0.3, 0.0,
    ];

    const triangleIndices = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      10, 10, 11,
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
    ];

    const stripBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, stripBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stripVertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.disableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttrib4f(colorAttributeLocation, 1.0, 1.0, 0.0, 1.0);

    const triangleIndicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndices), gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLE_STRIP, 25, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttrib4f(colorAttributeLocation, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.LINE_STRIP, 0, 11);
    gl.drawArrays(gl.LINE_STRIP, 11, 11);
  }
}
