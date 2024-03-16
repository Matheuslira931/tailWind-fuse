import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from "@angular/material/tabs";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {ActionsFormComponent} from "../../../../shared/components/actions-form/actions-form.component";
import {DialogFormComponent} from "../../../../shared/components/dialog-form/dialog-form.component";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-brand-form',
    templateUrl: './attachment-form.component.html',
    styleUrls: ['./attachment-form.component.scss'],
    imports: [
        MatTabsModule,
        MatIconModule,
        NgIf,
        MatInputModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatButtonModule,
        ActionsFormComponent,
        DialogFormComponent,
    ],
    standalone: true
})
export class AttachmentFormComponent {
    attachmentTypes: any[];

    constructor(private _dialogRef: MatDialogRef<AttachmentFormComponent>) {
    }

    getAttachmentType(): string {
        return '';
    }

    closeDialog(): void {
        this._dialogRef.close();
    }
}
