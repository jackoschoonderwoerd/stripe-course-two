import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'pick-up-info-dialog',
    templateUrl: './pick-up-info-dialog.component.html',
    styleUrls: ['./pick-up-info-dialog.component.scss']
})
export class PickUpInfoDialogComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }
    nextDate(dayIndex) {
        var today = new Date();
        today.setDate(today.getDate() + (dayIndex - 1 - today.getDay() + 7) % 7 + 1);
        return today;
    }
}
