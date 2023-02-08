import { CdkAriaLive } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cd, CdInfo } from '../../../core/interfaces/cd'
import { AddCdService } from './../add-cd.service'


@Component({
    selector: 'add-cd-info',
    templateUrl: './add-cd-info.component.html',
    styleUrls: ['./add-cd-info.component.scss']
})
export class AddCdInfoComponent implements OnInit {

    form: FormGroup;
    editMode: boolean = false;
    cd: Cd;
    imageUrl;

    @Input() importCdFromParent: Cd
    @Output() exportToParent = new EventEmitter<Cd>();
    @Output() closeForms = new EventEmitter<void>();


    constructor(
        private fb: FormBuilder,
        private addCdService: AddCdService
    ) { }

    ngOnInit(): void {
        console.log(this.importCdFromParent);
        if (this.importCdFromParent.cdInfo.recordingDate) {
            const insertRecordingDate = new Date(this.importCdFromParent.cdInfo.recordingDate);
            console.log(insertRecordingDate);
        }
        this.initForm();

        if (this.importCdFromParent.id != undefined) {
            console.log(this.importCdFromParent)
            this.editMode = true
            this.cd = this.importCdFromParent

            this.imageUrl = this.cd.cdInfo.imageUrl;
            this.form.setValue({
                title: this.cd.cdInfo.title,
                bandName: this.cd.cdInfo.bandName,
                recordingStudio: this.cd.cdInfo.recordingStudio ? this.cd.cdInfo.recordingStudio : null,
                recordingEngineer: this.cd.cdInfo.recordingEngineer ? this.cd.cdInfo.recordingEngineer : null,
                mixer: this.cd.cdInfo.mixer ? this.cd.cdInfo.mixer : null,
                producer: this.cd.cdInfo.producer,
                publisher: this.cd.cdInfo.publisher ? this.cd.cdInfo.publisher : null,
                recordingDate: this.cd.cdInfo.recordingDate ? new Date(this.cd.cdInfo.recordingDate) : null,
                price: this.cd.cdInfo.price
            })
        } else {

            // this.imageUrl = this.cd.cdInfo.imageUrl

        }
        console.log(this.cd);
    }

    initForm(): void {
        this.form = this.fb.group({
            title: new FormControl('', [Validators.required]),
            bandName: new FormControl('', [Validators.required]),
            recordingStudio: new FormControl(null),
            recordingEngineer: new FormControl(null),
            mixer: new FormControl(null),
            producer: new FormControl(null),
            publisher: new FormControl(null),
            recordingDate: new FormControl(null),
            price: new FormControl('', [Validators.required]),

        })
    }

    onFileInputChange(e: any): void {
        const file = e.target.files[0];
        this.addCdService.uploadImageToBucket(file)
            .subscribe((imageUrl: string) => {
                console.log(imageUrl)
                this.imageUrl = imageUrl;
            })
    }

    onSubmit() {
        // console.log( new Date(this.form.value.recordingDate._d).getTime());
        this.cd.cdInfo = this.form.value;
        console.log(new Date(this.cd.cdInfo.recordingDate).getTime())
        if (this.cd.cdInfo.recordingDate) {
            console.log(this.cd.cdInfo.recordingDate)
            this.cd.cdInfo.recordingDate = new Date(this.form.value.recordingDate).getTime()
        }
        this.cd.cdInfo.imageUrl = this.imageUrl;
        console.log(this.cd)
        this.exportToParent.emit(this.cd)
        this.closeForms.emit();
    }
    onCancel() {
        this.editMode = false;
        this.closeForms.emit()
    }

    returnCd() {
        return this.cd
    }
}

