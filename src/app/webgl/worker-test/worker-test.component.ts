import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-test.component.html',
  styleUrl: './worker-test.component.scss'
})
export class WorkerTestComponent implements OnInit {

  ngOnInit(): void {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./worker-test.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('hello');
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

}
