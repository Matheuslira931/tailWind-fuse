import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgIf} from "@angular/common";
import {ActionsFormComponent} from "../actions-form/actions-form.component";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-dialog-form',
    templateUrl: './dialog-form.component.html',
    styleUrls: ['./dialog-form.component.scss'],
    imports: [
        MatButtonModule,
        MatTooltipModule,
        NgIf,
        ActionsFormComponent,
        MatIconModule
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None
})
export class DialogFormComponent {
    @Output() save = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() toggleEditMode = new EventEmitter();
    @Input() title: string;
}
