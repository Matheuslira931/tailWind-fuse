import {Injectable} from '@angular/core';
import {PAYMENT_METHOD} from "../../constants/path-constants";
import {Observable} from "rxjs";
import {PaymentMethod} from "../../models/payment-method.model";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PaymentMethodService {
    private readonly BASE_URL = environment.URL_API;

    constructor(private httpClient: HttpClient) {
    }

    getAll(): Observable<PaymentMethod[]> {
        return this.httpClient.get<PaymentMethod[]>(`${this.BASE_URL}${PAYMENT_METHOD}items`);
    }
}
