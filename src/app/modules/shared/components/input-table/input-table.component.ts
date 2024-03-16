import {Component, Input, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CurrencyPipe, DatePipe, JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormArray} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {Account, AccountInstallment} from "../../../admin/service-orders/service-orders.types";
import {PaymentMethodService} from "../../services/payment-methods/payment-method.service";
import {PaymentMethod} from "../../models/payment-method.model";

const FORM_ARRAY_CONTROL = 'paymentInstallments';

@Component({
    selector: 'app-input-table',
    templateUrl: './input-table.component.html',
    imports: [
        MatButtonModule,
        MatTooltipModule,
        NgIf,
        NgClass,
        NgForOf,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        ReactiveFormsModule,
        JsonPipe,
        CurrencyPipe,
        DatePipe
    ],
    providers: [
        DatePipe,
    ],
    standalone: true
})
export class InputTableComponent implements OnInit {
    @Input() rows: number;
    @Input() editMode: boolean;
    @Input() account: Account;
    form: FormGroup = new FormGroup({
        paymentInstallments: this._formBuilder.array([])
    });
    paymentMethods = new Map<number, PaymentMethod>();

    constructor(private _formBuilder: FormBuilder,
                private _paymentMethodService: PaymentMethodService) {
    }

    ngOnInit(): void {
        this.loadPaymentMethods();
        this.buildFormGroups();
    }

    private buildFormGroups(): void {
        const installments = [];
        for (const installment of this.account.accountInstallment) {
            const formGroup = this.buildInstallmentGroup(installment);
            installments.push(formGroup);
        }
        installments.forEach(installments =>
            (this.form.get(FORM_ARRAY_CONTROL) as UntypedFormArray).push(installments)
        );
    }

    private loadPaymentMethods(): void {
        this._paymentMethodService.getAll().subscribe(paymentMethods => {
            for (const paymentMethod of paymentMethods) {
                this.paymentMethods.set(paymentMethod.id, paymentMethod);
            }
        });
    }

    private buildInstallmentGroup(installment: AccountInstallment): FormGroup {
        return this._formBuilder.group({
            paymentForm: new FormControl(installment.formapagamentoid),
            value: new FormControl(installment.valor),
            dueDate: new FormControl(installment.datavencimento),
        });
    }
}
