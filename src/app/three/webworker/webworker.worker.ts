/// <reference lib="webworker" />

import { AmbientLight, Color, DirectionalLight, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, TorusGeometry, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

addEventListener('message', ({ data }) => {
    const type = data.type;
    switch (type) {
        case 'main':
            main(data.canvas);
            break;
        case 'dispose':
            dispose();
    }
});

let glRender: any = null;

function dispose() {
    glRender.setAnimationLoop(null);
    glRender.dispose();
}

function main(canvas: OffscreenCanvas) {
    const scene = new Scene();
    scene.background = new Color(0xaabbcc);

    const camera = new PerspectiveCamera(75, 1600 / 900, 0.1, 1000);

    const renderer = glRender = new WebGLRenderer({ canvas, antialias: true });

    const color = 0xFFFFFF;
    const light = new DirectionalLight(color, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const light2 = new AmbientLight(color, 1);
    scene.add(light2);

    camera.position.z = 100;
    // const controls = new OrbitControls(camera, canvas);
    // controls.update();

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

        // controls.update();
        // console.time("render");
        renderer.render(scene, camera);
        // console.timeEnd("render");
    });



}
