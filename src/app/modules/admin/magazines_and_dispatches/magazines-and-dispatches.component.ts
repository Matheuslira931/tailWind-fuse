import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'process',
    templateUrl: './magazines-and-dispatches.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterOutlet],
})
export class MagazinesAndDispatchesComponent {
}
