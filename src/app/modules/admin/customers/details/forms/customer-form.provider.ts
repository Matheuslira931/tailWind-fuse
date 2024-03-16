import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class CustomerFormProvider {

    constructor(private _formBuilder: UntypedFormBuilder) {
    }

    buildCustomerPFForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [''],
            personalDocumentsForm: this._formBuilder.array([
                this._formBuilder.group({
                    value: ['', Validators.required],
                    label: [{
                        value: 'CPF',
                        disabled: true
                    }]
                }),
                this._formBuilder.group({
                    value: [''],
                    label: [{
                        value: 'RG',
                        disabled: true
                    }]
                }),
                this._formBuilder.group({
                    value: [''],
                    label: [{
                        value: 'Documento Profissional',
                        disabled: true
                    }]
                })
            ]),
            nome: ['', [Validators.required]],
            profissao: [''],
            estadocivil: [''],
            pais: [''],
            estado: [''],
            municipio: [''],
            cep: [''],
            endereco: [''],
            bairro: [''],
            numero: [''],
            complemento: [''],
            datanascimento: [''],
            nacionalidade: [''],
            companies: this._formBuilder.array([
                this._formBuilder.group({
                    empresa: [''],
                    cargo: ['']
                })
            ]),
            phoneNumbers: this._formBuilder.array([
                this._formBuilder.group({
                    value: ['', [Validators.required]],
                    type: ['', [Validators.required]]
                })
            ]),
            emails: this._formBuilder.array([
                this._formBuilder.group({
                    value: ['', [Validators.required]],
                    type: ['', [Validators.required]]
                })
            ])
        });
    }

    buildCustomerPJForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [''],
            fantasia: [''],
            razaoSocial: ['', [Validators.required]],
            cnpj: ['', [Validators.required]],
            inscricaoEstadual: [''],
            porteINPI: ['', [Validators.required]],
            pais: ['', [Validators.required]],
            estado: ['', [Validators.required]],
            municipio: ['', [Validators.required]],
            cep: ['', [Validators.required]],
            endereco: ['', [Validators.required]],
            bairro: ['', [Validators.required]],
            complemento: [''],
            numero: ['', [Validators.required]],
            phoneNumbers: this._formBuilder.array([
                this._formBuilder.group({
                    value: ['', [Validators.required]],
                    type: ['', [Validators.required]]
                })
            ]),
            emails: this._formBuilder.array([
                this._formBuilder.group({
                    value: ['', [Validators.required, Validators.email]],
                    type: ['', [Validators.required]]
                })
            ]),
            representativePeople: this._formBuilder.array([
                this._formBuilder.group({
                    person: ['', [Validators.required]],
                    position: ['', [Validators.required]]
                })
            ]),
        });
    }
}
