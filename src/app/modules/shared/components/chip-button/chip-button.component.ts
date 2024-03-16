import {Component, Input} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-chip-button',
    templateUrl: './chip-button.component.html',
    imports: [
        MatFormFieldModule,
        MatIconModule
    ],
    standalone: true
})
export class ChipButtonComponent {
    @Input() label: string;
    @Input() icon: string;
}
