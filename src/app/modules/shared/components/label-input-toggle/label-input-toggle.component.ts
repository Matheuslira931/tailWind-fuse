import { Component, Input } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgClass, NgIf, TitleCasePipe } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-label-input-toggle',
    templateUrl: './label-input-toggle.component.html',
    imports: [
        MatButtonModule,
        MatTooltipModule,
        NgIf,
        NgClass,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TitleCasePipe,
        ReactiveFormsModule
    ],
    standalone: true
})
export class LabelInputToggleComponent {
    @Input() readMode = true;
    @Input() blockChange = false;
    @Input() icon!: string;
    @Input() formControl: FormControl;

    toggle(): void {
        if (this.blockChange) {
            return;
        }
        this.readMode = !this.readMode;
    }

    onClickInput(event: MouseEvent): void {
        event.stopPropagation();
    }
}
