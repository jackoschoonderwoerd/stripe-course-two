import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Cd, Review } from '../../../core/interfaces/cd';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CdAndIndex } from '../add-tracks/add-tracks.component';

@Component({
    selector: 'add-review',
    templateUrl: './add-review.component.html',
    styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent implements OnInit {

    form: FormGroup;
    editmode: boolean = false
    @Input() importedCdFromParent: Cd;
    @Input() importCdAndIndexFromParent: CdAndIndex
    @Output() closeForms = new EventEmitter<void>();
    @Output() exportToParent = new EventEmitter<Cd>();
    cd: Cd;
    index: number;


    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initForm()
        if (this.importedCdFromParent != undefined) {
            this.cd = this.importedCdFromParent;

        } else if (this.importCdAndIndexFromParent != undefined) {
            this.editmode = true;
            this.cd = this.importCdAndIndexFromParent.cd;
            this.index = this.importCdAndIndexFromParent.index;
            this.form.patchValue({
                date: new Date(this.cd.reviews[this.index].date),
                source: this.cd.reviews[this.index].source,
                author: this.cd.reviews[this.index].author,
                content: this.cd.reviews[this.index].content
            })

        }
        console.log(this.cd);

    }

    initForm() {

        this.form = this.fb.group({
            date: new FormControl(null),
            source: new FormControl(null),
            author: new FormControl(null),
            content: new FormControl(null, [Validators.required])
        })
    }
    addReview() {

        const review: Review = {
            date: new Date(this.form.value.date).getTime(),
            source: this.form.value.source,
            author: this.form.value.author,
            content: this.form.value.content,

        }
        if (!this.editmode) {
            if (!this.cd.reviews) {
                this.cd.reviews = []
                this.cd.reviews.push(review)
            } else {
                this.cd.reviews.push(review);
            }
        } else {
            if (!this.cd.reviews) {
                this.cd.reviews[0] = review
            } else {
                this.cd.reviews[this.index] = review
            }
        }
        this.exportToParent.emit(this.cd);
        this.closeForms.emit();
    }

    onCancel() {
        this.closeForms.emit();
    }
}
