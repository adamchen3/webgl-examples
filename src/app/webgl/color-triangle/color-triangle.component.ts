import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-triangle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-triangle.component.html',
  styleUrl: './color-triangle.component.scss'
})
export class ColorTriangleComponent implements AfterViewInit {


  ngAfterViewInit(): void {
    const canvas = document.getElementById('color-triangle') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2');

    if (!gl) {
      console.log('no webgl2 context');
      return;
    }

    const vertexShaderCode = `
      attribute vec3 aVertexPosition;
      attribute vec4 aVertextColor;
      varying vec4 vColor;
      void main() {
        vColor = aVertextColor;
        gl_Position = vec4(aVertexPosition, 1.0);
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
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert("A shader compiling error occurred: " + gl.getShaderInfoLog(vertexShader));
      return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      return;
    }
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert("A shader compiling error occurred: " + gl.getShaderInfoLog(fragmentShader));
      return;
    }

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      return;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Error linking shader");
      return;
    }

    gl.useProgram(shaderProgram);

    const vertives = [
      -0.5, -0.5, 0.0, 255, 0, 0, 255,
      0.5, -0.5, 0.0, 0, 255, 0, 255,
      0.0, 0.5, 0.0, 0, 0, 255, 255
    ];

    const bufferLength = 3 * (12 + 4); // 每个顶点需要12 + 4个byte

    const byteBuffer = new ArrayBuffer(bufferLength);
    const positionView = new Float32Array(byteBuffer);
    const colorView = new Uint8Array(byteBuffer);

    for (let i = 0; i < 3; i++) {
      const index = i * 7;
      const positionIndex = i * 4;
      const colorIndex = (i * 16) + 12;

      positionView[positionIndex] = vertives[index]
      positionView[positionIndex + 1] = vertives[index + 1];
      positionView[positionIndex + 2] = vertives[index + 2];
      colorView[colorIndex] = vertives[index + 3];
      colorView[colorIndex + 1] = vertives[index + 4];
      colorView[colorIndex + 2] = vertives[index + 5];
      colorView[colorIndex + 3] = vertives[index + 6];
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // 这个一次只能bind一个，如果bind另外一个，那么之前bind的就会解bind。
    gl.bufferData(gl.ARRAY_BUFFER, byteBuffer, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    const colorAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertextColor");

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);

    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 16, 0); // 参数作用看API文档吧
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.UNSIGNED_BYTE, true, 16, 12); // 参数作用看API文档吧


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

}
