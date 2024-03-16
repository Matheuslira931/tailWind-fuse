import {Routes} from '@angular/router';
import {MagazinesAndDispatchesComponent} from "./magazines-and-dispatches.component";
import {MagazineAndDispatchesComponent} from "./detailed/detailed.component";

export default [
    {
        path: '',
        component: MagazinesAndDispatchesComponent,
        children: [
            {
                path: '',
                component: MagazineAndDispatchesComponent,
            },
        ],
    },
] as Routes;
