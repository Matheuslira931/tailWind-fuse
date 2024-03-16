import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgIf, TitleCasePipe} from "@angular/common";

@Component({
    selector: 'app-view-input-swap',
    templateUrl: './view-input-swap.component.html',
    styles: [``],
    imports: [
        MatProgressBarModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        NgIf,
        TitleCasePipe
    ],
    standalone: true
})
export class ViewInputSwap {
    @Input() viewMode = true;
    @Input() icon: string;

    toggleMode(): void {
        this.viewMode = !this.viewMode;
    }
}
