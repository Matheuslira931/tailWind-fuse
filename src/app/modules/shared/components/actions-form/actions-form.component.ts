import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgClass, NgIf } from "@angular/common";

@Component({
    selector: 'app-actions-form',
    templateUrl: './actions-form.component.html',
    imports: [
        MatButtonModule,
        MatTooltipModule,
        NgIf,
        NgClass
    ],
    standalone: true
})
export class ActionsFormComponent {
    @Output() save = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Input() record: any;
    @Input() saveDisabled?: boolean = false;
    @Input() hasTopMargin = true;
    @Input() showRemoveButton = false;
    @Input() showBackground = true;

    emitSaveEvent(): void {
        this.save.emit();
    }

    emitDeleteEvent(): void {
        this.delete.emit();
    }
}
