import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgClass, NgIf } from "@angular/common";

export type ImageHeaderStyle = 'square' | 'rounded';

@Component({
    selector: 'app-details-header',
    templateUrl: './details-header.component.html',
    imports: [
        MatTooltipModule,
        MatIconModule,
        MatButtonModule,
        NgIf,
        NgClass
    ],
    standalone: true
})
export class DetailsHeaderComponent {
    @ViewChild('inputFile') inputFile!: ElementRef;

    @Output() onEdit = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();
    @Input() viewMode: boolean;
    @Input() showIcon = true;
    @Input() imageLabel!: string;
    @Input() imageSrc!: string;
    @Input() showImage = true;
    @Input() editLabel = 'Editar';
    @Input() uploadPicture = false;
    @Input() imageStyle: ImageHeaderStyle = 'rounded';

    loadedPicture = false;
    imageUrl: any;

    emitEditEvent(): void {
        this.onEdit.emit();
    }

    close(): void {
        this.onClose.emit();
    }

    openFileWindow(): void {
        this.inputFile.nativeElement.click();
    }

    uploadFile(event: any): void {
        const mimeType = event.target.files[0].type;

        if (mimeType.match(/image\/*/) == null) {
            console.log('Only images are supported');
            return;
        }

        if (!event.target.files[0] || event.target.files[0].length == 0) {
            console.log('You must select an image');
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (_event) => {
            this.imageUrl = reader.result;
            this.loadedPicture = true;
        }
    }
}
