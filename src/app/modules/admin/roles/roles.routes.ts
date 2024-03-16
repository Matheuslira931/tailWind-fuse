import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {RolesComponent} from "./roles.component";
import {RolesService} from "./roles.service";
import {RolesDetailsComponent} from "./details/details.component";
import {RolesListComponent} from "./list/list.component";

const positionResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const rolesService = inject(RolesService);
    const router = inject(Router);

    let id = route.paramMap.get('id');
    return rolesService.getById(+id)
        .pipe(
            // Error here means the requested contact is not available
            catchError((error) =>
            {
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
    component: RolesDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) =>
{
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while ( nextRoute.firstChild )
    {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/roles'
    // it means we are navigating away from the
    // roles app
    if (!nextState.url.includes('/roles'))
    {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if ( nextRoute.paramMap.get('id') )
    {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path     : '',
        component: RolesComponent,
        children : [
            {
                path     : '',
                component: RolesListComponent,
                children : [
                    {
                        path         : 'new',
                        component    : RolesDetailsComponent,
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                    {
                        path         : ':id',
                        component    : RolesDetailsComponent,
                        position  : positionResolver,
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
