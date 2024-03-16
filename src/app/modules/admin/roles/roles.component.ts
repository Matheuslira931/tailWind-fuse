import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'roles',
    templateUrl    : './roles.component.html',
    encapsulation  : ViewEncapsulation.None,
    standalone     : true,
    imports        : [RouterOutlet],
})
export class RolesComponent {
}
