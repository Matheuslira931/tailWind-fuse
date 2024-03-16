import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatInputModule} from "@angular/material/input";
import {NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatListModule} from "@angular/material/list";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ActionsFormComponent} from "../../../shared/components/actions-form/actions-form.component";
import {CustomersService} from "../../customers/customers.service";
import {CustomerList} from "../../customers/customers.types";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DetailsHeaderComponent} from "../../../shared/components/details-header/details-header.component";
import {Process} from "../process.types";
import {ChipButtonComponent} from "../../../shared/components/chip-button/chip-button.component";

@Component({
    selector: 'process-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
        }
    `],
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        TextFieldModule,
        MatInputModule,
        NgIf,
        NgClass,
        MatDatepickerModule,
        MatListModule,
        RouterLink,
        ActionsFormComponent,
        MatAutocompleteModule,
        NgForOf,
        TitleCasePipe,
        DetailsHeaderComponent,
        ChipButtonComponent
    ],
})
export class ProcessFormComponent implements OnInit {
    @Input() record!: Process;
    customerList: CustomerList[] = [];

    form: FormGroup;

    constructor(private customersService: CustomersService,
                private _activatedRoute: ActivatedRoute,
                private _router: Router) {
    }

    ngOnInit(): void {
        this.customersService.getAll().subscribe((response: any) => {
            this.customerList = response.records;
        });
    }

    onCancel(): void {
        this._router.navigate(['..'], {relativeTo: this._activatedRoute});
    }

    onSave(): void {
    }

    getCustomerName(customer: any): string {
        return customer?.descricao || customer?.fantasia;
    }
}
