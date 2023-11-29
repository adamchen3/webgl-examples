import { Routes } from '@angular/router';
import { TriangleComponent } from './triangle/triangle.component';
import { MaterialPerformanceTestComponent } from './three/material-performance-test/material-performance-test.component';
import { WorkerTestComponent } from './webgl/worker-test/worker-test.component';
import { ColorTriangleComponent } from './webgl/color-triangle/color-triangle.component';

export const routes: Routes = [
    {
        path: 'triangle',
        component: TriangleComponent,

    },
    {
        path: 'three-material-performance-test',
        component: MaterialPerformanceTestComponent
    },
    {
        path: 'webgl-worker-test',
        component: WorkerTestComponent
    },
    {
        path: 'webgl-color-triangle',
        component: ColorTriangleComponent
    }
];
