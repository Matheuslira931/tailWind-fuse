import {ElementRef} from "@angular/core";
import Inputmask from "inputmask";
import * as textMask from "vanilla-text-mask/dist/vanillaTextMask";

export class MaskHelper {
    static addPhoneNumberMask(elementRef: ElementRef): void {
        Inputmask(MaskHelper.getPhoneNumberMask()).mask(elementRef.nativeElement);
    }

    static addCPFMask(elementRef: ElementRef): void {
        Inputmask(MaskHelper.getCPFMask()).mask(elementRef.nativeElement);
    }

    static addCNPJMask(elementRef: ElementRef): void {
        Inputmask(MaskHelper.getCNPJMask()).mask(elementRef.nativeElement);
    }

    static addInsricaoEstadualMask(elementRef: ElementRef): void {
        Inputmask(MaskHelper.getInsricaoEstadualMask()).mask(elementRef.nativeElement);
    }

    static addDateMask(elementRef: ElementRef): void {
        textMask.maskInput({
            inputElement: elementRef.nativeElement,
            mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
        });
    }

    private static getPhoneNumberMask(): { mask: string } {
        return {mask: "(99) 99999-9999"};
    }

    private static getCPFMask(): { mask: string } {
        return {mask: "999.999.999-99"};
    }

    private static getCNPJMask(): { mask: string } {
        return {mask: "99.999.999/9999-99"};
    }

    private static getInsricaoEstadualMask(): { mask: string } {
        return {mask: "999.999.999.999"};
    }
}
