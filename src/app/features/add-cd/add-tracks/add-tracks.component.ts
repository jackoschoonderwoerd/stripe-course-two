import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Track } from './../../../core/interfaces/track';

import { AddCdService } from './../add-cd.service'
import { Cd } from 'app/core/interfaces/cd';

export interface CdAndIndex {
    cd: Cd,
    index: number
}

@Component({
    selector: 'add-tracks',
    templateUrl: './add-tracks.component.html',
    styleUrls: ['./add-tracks.component.scss']
})



export class AddTracksComponent implements OnInit {

    cd: Cd
    form: FormGroup;
    editMode: boolean;
    index: number
    
    @Input() importCdAndIndexFromParent: CdAndIndex;
    @Input() importCdFromParent: Cd;
    @Output() closeForms = new EventEmitter<void>()

    constructor(
        private fb: FormBuilder,
        ) { }

    ngOnInit(): void {
        console.log(this.importCdAndIndexFromParent)
        this.initForm()
        if(this.importCdFromParent != undefined) {
       
            console.log(this.importCdFromParent);
            this.cd = this.importCdFromParent
        }
        if(this.importCdAndIndexFromParent != undefined) {
            console.log(this.importCdAndIndexFromParent)
            this.editMode = true
            this.cd = this.importCdAndIndexFromParent.cd;
            this.index = this.importCdAndIndexFromParent.index;
            this.form.setValue({
                ...this.cd.tracks[this.index]
            })
        }
    }

    initForm() {
        this.form = this.fb.group({
            number: new FormControl(null, Validators.required),
            title: new FormControl(null, Validators.required),
            composer: new FormControl(null),
            lyricist: new FormControl(null),
            minutes: new FormControl(null),
            seconds: new FormControl(null)
        })
    }
 
    onSaveTrack() {
        if(!this.editMode) {
            this.cd.tracks.push(this.form.value);
        } else {
            this.cd.tracks[this.index] = this.form.value
        }
        this.sortTracks();
        this.closeForms.emit()
    }

    onCancelAddTrack() {
        console.log('onCancelAddTrack()')
       
        this.closeForms.emit();
    }
    private sortTracks() {
        console.log('sorting tracks');
        this.cd.tracks = this.cd.tracks.sort((a, b) => {
            return a.number - b.number
        })
    }

}
