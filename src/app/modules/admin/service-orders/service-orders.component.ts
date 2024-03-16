import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'roles',
    templateUrl: './service-orders.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterOutlet],
})
export class ServiceOrdersComponent {
}
