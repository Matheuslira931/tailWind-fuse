import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FuseAlertComponent} from "../../../../../@fuse/components/alert";
import {NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {CardOptions} from "./card-options.types";

@Component({
    selector: 'app-card-options',
    templateUrl: './card-options.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseAlertComponent,
        NgIf,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        NgForOf
    ],
})
export class CardOptionsComponent {
    @Input() title: string;
    @Input() options: CardOptions[];

    onClick(option: CardOptions): void {
        option.onClick();
    }
}
