import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CdsService } from 'app/core/services/cds.service';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    @Output() closeFilter = new EventEmitter<void>()

    form: FormGroup

    constructor(
        private fb: FormBuilder,
        private cdsService: CdsService) { }

    ngOnInit(): void {
        this.initForm()
    }
    initForm() {
        this.form = this.fb.group({
            musicianName: new FormControl('victor de boo')
        })
    }

    onSearch() {
        console.log()
        const musicianName = this.form.value.query
        const selectedCds =  this.cdsService.getCdsByMusicanName('Leo Bouwmeester');
        console.log(selectedCds)
    }
    onClose() {
        console.log('close')
        this.closeFilter.emit();
    }
}
