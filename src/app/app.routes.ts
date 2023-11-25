import { Routes } from '@angular/router';
import { TriangleComponent } from './triangle/triangle.component';
import { MaterialPerformanceTestComponent } from './three/material-performance-test/material-performance-test.component';

export const routes: Routes = [
    {
        path: 'triangle',
        component: TriangleComponent,

    },
    {
        path: 'three-material-performance-test',
        component: MaterialPerformanceTestComponent
    }
];
