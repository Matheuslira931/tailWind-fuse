import {Route} from '@angular/router';
import {initialDataResolver} from 'app/app.resolvers';
import {AuthGuard} from 'app/core/auth/guards/auth.guard';
import {NoAuthGuard} from 'app/core/auth/guards/noAuth.guard';
import {LayoutComponent} from 'app/layout/layout.component';
import {
    CARGOS,
    CLIENTES,
    DASHBOARDS, MAGAZINES_AND_DISPATCHES,
    MARCAS,
    ORDENS_DE_SERVICO,
    USUARIOS
} from "./modules/shared/constants/routes-constants";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/cargos'
    {path: '', pathMatch : 'full', redirectTo: DASHBOARDS},

    // Redirect signed-in user to the '/cargos'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: DASHBOARDS},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: CARGOS, loadChildren: () => import('app/modules/admin/roles/roles.routes')},
            {path: MAGAZINES_AND_DISPATCHES, loadChildren: () => import('app/modules/admin/magazines_and_dispatches/magazines-and-dispatches.routes')},
            {path: USUARIOS, loadChildren: () => import('app/modules/admin/users/users.routes')},
            {path: CLIENTES, loadChildren: () => import('app/modules/admin/customers/customers.routes')},
            {path: MARCAS, loadChildren: () => import('app/modules/admin/process/process.routes')},
            {path: DASHBOARDS,
                children: [
                    {path: '', loadChildren: () => import('app/modules/admin/dashboards/project/project.routes')},
                ]
            },
            {path: ORDENS_DE_SERVICO, loadChildren: () => import('app/modules/admin/service-orders/service-orders.routes')},
        ]
    }
];
