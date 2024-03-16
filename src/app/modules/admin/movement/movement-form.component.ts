// import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
// import {MovementService} from './movement.service';
// import {FormBuilder, ReactiveFormsModule, UntypedFormGroup} from '@angular/forms';
// import {MovementList, ProcessHistoryDetail} from './movement.model';
// import {MagazinesService} from '../../shared/services/magazines/magazines.service';
// import {MagazineList} from '../../shared/models/magazine.model';
// import {map, switchMap} from 'rxjs';
// import {MovementType} from './movement.enum';
// import {ProcessService} from "../process/process.service";
// import {MatTabsModule} from "@angular/material/tabs";
// import {MatIconModule} from "@angular/material/icon";
// import {NgIf} from "@angular/common";
// import {MatInputModule} from "@angular/material/input";
// import {MatAutocompleteModule} from "@angular/material/autocomplete";
// import {MatDatepickerModule} from "@angular/material/datepicker";
// import {MatButtonModule} from "@angular/material/button";
// import {ActionsFormComponent} from "../../shared/components/actions-form/actions-form.component";
//
// const typeNumberByMovementType = new Map<MovementType, number>([
//     [MovementType.PETITION, 1],
//     [MovementType.DISPATCH, 2],
//     [MovementType.FREE_TEXT, 3],
// ]);
//
// @Component({
//     selector: 'app-movement-form',
//     templateUrl: './movement-form.component.html',
//     styleUrls: ['./movement-form.component.scss'],
//     imports: [
//         MatTabsModule,
//         MatIconModule,
//         NgIf,
//         MatInputModule,
//         ReactiveFormsModule,
//         MatAutocompleteModule,
//         MatDatepickerModule,
//         MatButtonModule,
//         ActionsFormComponent
//     ],
//     standalone: true
// })
// export class MovementFormComponent implements OnInit {
//
//     @ViewChild('inputFile') inputFile!: ElementRef;
//     form!: UntypedFormGroup;
//
//
//
//     constructor(private _dialogRef: MatDialogRef<MovementFormComponent>,
//                 @Inject(MAT_DIALOG_DATA) public data: any,
//                 private _movementService: MovementService,
//                 private _magazinesService: MagazinesService,
//                 private _processService: ProcessService,
//                 private _formBuilder: FormBuilder) {
//     }
//
//     ngOnInit(): void {
//         this.form = this.buildForm();
//         this.patchFormValue();
//         if (!!this.data.movementType) {
//             this.handleNewMovement();
//             return;
//         }
//         this.data = {
//             id: this.data.movementId,
//             ...this.data
//         };
//         /**
//          * It is allowed only image types and pdfs in the attachments
//          */
//         this.findAllMovementsByType();
//         if (this.data?.type === 1 && this.data?.magazineNumber) {
//             this._magazinesService.getItemsPaged()
//                 .pipe(map(response => response.records),
//                     switchMap((records) => {
//                         this.magazineList = records;
//                         return this._magazinesService.getById(this.data?.magazineId);
//                     }))
//                 .subscribe((magazine) => {
//                     const magazineIndex = this.magazineList.findIndex(value => value.numerorevista === magazine.numerorevista);
//                     if (magazineIndex === -1) {
//                         this.magazineList.push({
//                             id: magazine.id,
//                             numerorevista: magazine.numerorevista,
//                             datarevista: magazine.datarevista
//                         });
//                         const magazineFound = this.magazineList[this.magazineList.length - 1];
//                         this.form.get('magazineNumber').setValue(magazineFound);
//                     } else {
//                         const magazineFound = this.magazineList[magazineIndex];
//                         this.form.get('magazineNumber').setValue(magazineFound);
//                     }
//                 });
//         }
//     }
//
//     onCancelClick(): void {
//         this._dialogRef.close();
//     }
//
//     onDropFile(): void {
//         this.inputFile.nativeElement.click();
//     }
//
//     shouldShowTab(type: number): boolean {
//         return this.data.type === type;
//     }
//
//     onSaveClick(): void {
//         const movement = this.form.get('movementId').getRawValue() as MovementList;
//         const magazine = this.form.get('magazineNumber').getRawValue() as MagazineList;
//         const payload: Partial<ProcessHistoryDetail> = {
//             movementId: movement?.id,
//             newMagazineNumber: this.form.get('newMagazineNumber').getRawValue(),
//             type: this.data.type,
//             attachment: [],
//             magazineNumber: magazine?.numerorevista,
//             title: this.form.get('title')?.getRawValue(),
//             freeText: this.form.get('freeText')?.getRawValue(),
//             protocolDate: this.getProtocolDate(),
//             magazineDate: this.form.get('magazineDate')?.getRawValue(),
//         };
//     }
//
//     onSelectFile(event: any): void {
//         const file: File = event?.target?.files[0];
//
//     }
//
//     private findAllMovementsByType(): void {
//         const movementType = this.data.type || typeNumberByMovementType.get(this.data.movementType);
//         this._movementService.getMovementsByType(movementType)
//             .subscribe((movements) => {
//                 this.movementList = movements;
//                 const movementFoundIndex = this.movementList.findIndex(movement => movement.id === this.data.movementId);
//                 const movement = this.movementList[movementFoundIndex];
//                 this.form.get('movementId').setValue(movement);
//             });
//     }
//
//     private patchFormValue(): void {
//         this.form.patchValue({
//             freeText: this.data?.freeText,
//             magazineDate: this.data?.magazineDate,
//             magazineNumber: this.data?.magazineNumber,
//             movementId: this.data?.movementId,
//             protocolDate: this.data?.protocolDate,
//             protocolNumber: this.data?.protocolNumber,
//             type: this.data?.type,
//             attachment: this.data?.attachment,
//             newMagazineNumber: this.data?.newMagazineNumber,
//             freeTextTitle: this.data?.freeTextTitle,
//         });
//     }
//
//     private buildForm(): UntypedFormGroup {
//         return this._formBuilder.group({
//             freeText: [],
//             magazineDate: [],
//             magazineNumber: [],
//             movementId: [],
//             protocolDate: [],
//             protocolNumber: [],
//             type: [],
//             attachment: [],
//             newMagazineNumber: [],
//             freeTextTitle: [],
//         });
//     }
//
//     private getProtocolDate(): Date | null {
//         if (typeof (this.form.get('protocolDate')?.getRawValue()) === 'string') {
//             return new Date(this.form.get('protocolDate')?.getRawValue());
//         }
//         return this.form.get('protocolDate')?.getRawValue()?.toDate();
//     }
//
//     private handleNewMovement(): void {
//         this.data.type = typeNumberByMovementType.get(this.data.movementType);
//     }
// }
