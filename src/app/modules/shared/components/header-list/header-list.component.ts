import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgClass, NgIf } from "@angular/common";

@Component({
    selector: 'app-list-header',
    templateUrl: './header-list.component.html',
    styleUrls: ['./header-list.component.scss'],
    imports: [
        MatProgressBarModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        NgIf,
        NgClass
    ],
    standalone: true
})
export class HeaderListComponent implements OnInit {
    @Input() title!: string;
    @Input() subtitle?: string;
    @Input() isLoading!: boolean;
    @Input() showNewButton = true;
    @Input() showBorder = true;
    @Output() search = new EventEmitter<string>();
    @Output() newRecord = new EventEmitter<void>();
    protected searchClient = new FormControl('');

    ngOnInit(): void {
        this.watchSearchChanges();
    }

    private watchSearchChanges(): void {
        this.searchClient.valueChanges.pipe(debounceTime(250))
            .subscribe(valueToSearch => this.search.emit(valueToSearch));
    }
}
