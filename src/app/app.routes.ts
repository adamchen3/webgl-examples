import { Routes } from '@angular/router';
import { TriangleComponent } from './webgl/triangle/triangle.component';
import { MaterialPerformanceTestComponent } from './three/material-performance-test/material-performance-test.component';
import { WorkerTestComponent } from './webgl/worker-test/worker-test.component';
import { ColorTriangleComponent } from './webgl/color-triangle/color-triangle.component';
import { ShapesComponent } from './webgl/shapes/shapes.component';
import { TransformComponent } from './webgl/transform/transform.component';
import { WebworkerComponent } from './three/webworker/webworker.component';

export const routes: Routes = [
    {
        path: 'webgl-triangle',
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
    },
    {
        path: 'webgl-shapes',
        component: ShapesComponent
    },
    {
        path: 'webgl-transform',
        component: TransformComponent
    },
    {
        path: 'three-webworker',
        component: WebworkerComponent
    }
];
