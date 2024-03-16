import {AbstractControl} from "@angular/forms";
import {debounceTime, filter} from "rxjs";

export class FormHelper {
    static transformToUppercase(formControl: AbstractControl): void {
        formControl?.valueChanges?.pipe(
            debounceTime(250),
            filter(Boolean)
        ).subscribe((value?: string) => formControl?.setValue(value.toUpperCase()));
    }
}
