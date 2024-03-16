import {inject} from '@angular/core';
import {Routes} from '@angular/router';
import {ProjectComponent} from 'app/modules/admin/dashboards/project/project.component';
import {DashboardService} from 'app/modules/admin/dashboards/project/dashboard.service';

export default [
    {
        path: '',
        component: ProjectComponent,
        resolve: {
            data: () => inject(DashboardService).getData(),
        },
    },
] as Routes;
