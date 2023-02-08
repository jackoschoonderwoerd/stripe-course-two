import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from 'app/core/interfaces/cd';

@Component({
    selector: 'review-dialog',
    templateUrl: './review-dialog.component.html',
    styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialogComponent implements OnInit {


    review: Review;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ReviewDialogComponent>
    ) { }

    ngOnInit(): void {

        console.log(this.data.review);
        this.review = this.data.review;
    }
    onNoClick() {
        this.dialogRef.close()
    }
}
