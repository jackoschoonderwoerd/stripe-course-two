import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cd } from 'app/core/interfaces/cd';

@Component({
    selector: 'cd-dialog',
    templateUrl: './cd-dialog.component.html',
    styleUrls: ['./cd-dialog.component.scss']
})
export class CdDialogComponent implements OnInit {


    cd: Cd;
    parent: string

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CdDialogComponent>, private ngZone: NgZone
        ) { }



    ngOnInit(): void {
        this.cd = this.data.cd,
        this.parent = this.data.parent
    }
    onNoClick() {
        this.ngZone.run(() => {
            this.dialogRef.close();
        })
    }
    onClose() {
        console.log('close')
        this.dialogRef.close();
    }
}
