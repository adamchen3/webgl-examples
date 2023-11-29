import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-test.component.html',
  styleUrl: './worker-test.component.scss'
})
export class WorkerTestComponent implements OnInit, AfterViewInit {

  private _worker!: Worker;

  ngOnInit(): void {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = this._worker = new Worker(new URL('./worker-test.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('hello');
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById("webgl-worker-test") as HTMLCanvasElement;
    // const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    this._worker.postMessage("WebGL Context", [canvas.transferControlToOffscreen()]);
    // console.log(canvas);
    // const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  }

}
