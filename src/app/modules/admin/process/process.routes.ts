import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {ProcessComponent} from "./process.component";
import {ProcessService} from "./process.service";
import {ProcessDetailsComponent} from "./details/details.component";
import {ProcessListComponent} from "./list/list.component";
import {ProcessDetailedComponent} from "./detailed/detailed.component";
import {ServiceOrderListComponent} from "../service-orders/list/list.component";
import {ServiceOrderDetailsComponent} from "../service-orders/details/details.component";
import {ProcessFormComponent} from "./form/form.component";
import {FreeTextFormComponent} from "../movement/forms/free-text/free-text-form.component";
import {DispatchFormComponent} from "../movement/forms/dispatch/dispatch-form.component";
import {PetitionFormComponent} from "../movement/forms/petition/petition-form.component";

const positionResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const rolesService = inject(ProcessService);
    const router = inject(Router);

    let id = route.paramMap.get('id');
    return rolesService.getById(+id)
        .pipe(
            // Error here means the requested contact is not available
            catchError((error) => {
                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            }),
        );
};

/**
 * Can deactivate roles details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateContactsDetails = (
    component: ProcessDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/roles'
    // it means we are navigating away from the
    // roles app
    if (!nextState.url.includes('/roles')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: ProcessComponent,
        children: [
            {
                path: '',
                component: ProcessListComponent,
                children: [
                    {
                        path: 'new',
                        component: ProcessDetailsComponent,
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                    {
                        path: ':id',
                        component: ProcessDetailsComponent,
                        position: positionResolver,
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                    {
                        path: ':id/details',
                        component: ProcessDetailedComponent,
                        canDeactivate: [canDeactivateContactsDetails],
                        children: [
                            {
                                path: 'edit',
                                component: ProcessFormComponent,
                            },
                            {
                                path: 'new/history/petition',
                                component: PetitionFormComponent,
                            },
                            {
                                path: 'new/history/dispatch',
                                component: DispatchFormComponent,
                            },
                            {
                                path: 'new/history/free-text',
                                component: FreeTextFormComponent,
                            },
                            {
                                path: 'history/dispatch/:id',
                                component: PetitionFormComponent,
                            },
                            {
                                path: 'history/petition/:id',
                                component: PetitionFormComponent,
                            },
                            {
                                path: 'history/free-text/:id',
                                component: PetitionFormComponent,
                            },
                        ]
                    },
                ],
            },
        ],
    },
] as Routes;
