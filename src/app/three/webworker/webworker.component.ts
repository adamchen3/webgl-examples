import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-webworker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './webworker.component.html',
  styleUrl: './webworker.component.scss'
})
export class WebworkerComponent implements OnInit, AfterViewInit {

  private _worker!: Worker;

  ngOnInit(): void {
    if (typeof Worker !== 'undefined') {
      const worker = this._worker = new Worker(new URL('./webworker.worker', import.meta.url));

      worker.onmessage = ({ data }) => {
        // console.log(`page got message: ${data}`);
      };

    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById("three-webworker") as HTMLCanvasElement;
    canvas.width = 1600;
    canvas.height = 900;
    const offscreen = canvas.transferControlToOffscreen();
    this._worker.postMessage({ type: 'main', canvas: offscreen }, [offscreen]);
  }

  ngOnDestroy(): void {
    this._worker.postMessage({ type: 'dispose' });
  }
}
