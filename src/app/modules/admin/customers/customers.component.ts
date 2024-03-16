import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'customers',
    templateUrl: './customers.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterOutlet],
})
export class CustomersComponent {
}
