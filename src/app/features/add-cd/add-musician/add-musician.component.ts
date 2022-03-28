import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cd } from 'app/core/interfaces/cd';
import { Musician } from 'app/core/interfaces/musician';
import { AddCdService } from '../add-cd.service';
import { CdAndIndex } from '../add-tracks/add-tracks.component';

@Component({
    selector: 'add-musician',
    templateUrl: './add-musician.component.html',
    styleUrls: ['./add-musician.component.scss']
})
export class AddMusicianComponent implements OnInit {

    form: FormGroup
    editMode: boolean = false;
    cd: Cd;
    index: number;
    

    @Input() importCdFromParent: Cd;
    @Input() importCdAndIndexFromParent: CdAndIndex;
    @Output() closeForms = new EventEmitter<void>()

    constructor(
        private fb: FormBuilder,
        private addCdService: AddCdService) { }

    ngOnInit(): void {
        this.initForm();
        if(this.importCdFromParent != undefined) {
            this.cd = this.importCdFromParent
            console.log(this.cd);
            this.form.reset();
            this.form.updateValueAndValidity();
        }
        if(this.importCdAndIndexFromParent != undefined) {
            this.editMode = true;
            this.cd = this.importCdAndIndexFromParent.cd;
            this.index = this.importCdAndIndexFromParent.index;
            const musician: Musician = this.cd.musicians[this.index];
            
            this.form.patchValue({
                name: musician.name,  
            });
            this.fillArrayWithInstruments(musician.instruments);
        }
    }

    initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required]),
            instruments: new FormArray([])
        })
    }
    getInstrumentControls() {
        return (<FormArray>this.form.get('instruments')).controls;
    }
    onAddInstrument() {
        const control = new FormControl(null);
        console.log(this.form.get('instruments'));
        (<FormArray>this.form.get('instruments')).push(control);
    }

    fillArrayWithInstruments(instruments: string[]) {
        const controls: FormControl[] = []
        instruments.forEach((instrument: string) => {
            controls.push(new FormControl(instrument))
        })
        controls.forEach((control: FormControl) => {
            (<FormArray>this.form.get('instruments')).push(control);
        })
    }

    onAddMusician() {
        this.form.value.instruments = this.form.value.instruments.filter((value) => {
            return value !== null;
        })
        this.form.value.instruments = this.form.value.instruments.filter((value) => {
            return value !== '';
        })
        if(this.editMode) {
            this.cd.musicians[this.index] = this.form.value
        } else {
            this.cd.musicians.push(this.form.value);
        }
        this.form.reset();
        this.closeForms.emit()
    }

    onCancel() {
        this.closeForms.emit()
    }
}
