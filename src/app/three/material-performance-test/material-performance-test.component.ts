import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AmbientLight, BoxGeometry, Color, DirectionalLight, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, TorusGeometry, WebGLRenderer } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-material-performance-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './material-performance-test.component.html',
  styleUrl: './material-performance-test.component.scss'
})
export class MaterialPerformanceTestComponent implements AfterViewInit, OnDestroy {

  private _renderer!: WebGLRenderer;

  ngAfterViewInit(): void {
    const canvas = document.getElementById("three-material-performance-test") as HTMLCanvasElement;
    const scene = new Scene();
    scene.background = new Color(0xaabbcc);

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = this._renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // const da = renderer.getContext().drawArrays;
    // renderer.getContext().drawArrays = (...args) => {
    //   console.log("draw");
    //   da(...args);
    // }

    // const de = renderer.getContext().drawElements;
    // renderer.getContext().drawElements = (...args) => {
    //   console.log("draw2");
    //   // de(...args);
    // }

    const color = 0xFFFFFF;
    const light = new DirectionalLight(color, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const light2 = new AmbientLight(color, 1);
    scene.add(light2);

    camera.position.z = 100;
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    const material = new MeshLambertMaterial({ color: 0x00ff00 }); // 共用一个材质实例对提升性能确实有帮助
    for (let i = 0; i < 10000; i++) {
      const geometry = new TorusGeometry(10, 3, 16, 100);
      // const material = new MeshLambertMaterial({ color: 0x00ff00 });
      const cube = new Mesh(geometry, material);
      cube.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 20 - 10);
      scene.add(cube);
    }

    // renderer.render(scene, camera);
    // return;

    let frames = 0, prevTime = performance.now();
    renderer.setAnimationLoop(() => {
      frames++;
      const time = performance.now();
      if (time >= prevTime + 1000) {
        console.log(Math.round((frames * 1000) / (time - prevTime)));
        frames = 0;
        prevTime = time;
      }

      controls.update();
      // console.time("render");
      renderer.render(scene, camera);
      // console.timeEnd("render");
    });
  }

  ngOnDestroy(): void {
    this._renderer.setAnimationLoop(null);
    this._renderer.dispose();
  }

}
