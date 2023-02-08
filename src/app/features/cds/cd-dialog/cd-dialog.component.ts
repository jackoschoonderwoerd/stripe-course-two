import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Cd } from 'app/core/interfaces/cd';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';

@Component({
    selector: 'cd-dialog',
    templateUrl: './cd-dialog.component.html',
    styleUrls: ['./cd-dialog.component.scss']
})
export class CdDialogComponent implements OnInit {


    cd: Cd;
    parent: string;
    showCover: boolean = false;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CdDialogComponent>, private ngZone: NgZone,
        private dialog: MatDialog
    ) { }



    ngOnInit(): void {
        this.cd = this.data.cd,
            this.parent = this.data.parent;
        console.log(this.data)
        if (this.data.showList) {
            this.showCover = true
        }
    }
    onNoClick() {
        this.ngZone.run(() => {
            this.dialogRef.close();
        })
    }
    onReview(review) {
        this.dialog.open(ReviewDialogComponent, {
            data: {
                review
            },
            minWidth: '310px',
            maxWidth: '500px',
            panelClass: 'custom-dialog-container',
            height: '100%'
        })
    }

    onClose() {
        console.log('close')
        this.dialogRef.close();
    }
}
