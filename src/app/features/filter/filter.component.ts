

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdsService } from 'app/core/services/cds.service';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { NavigationService } from '../navigation/navigation.service';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {


    @Output() closeFilter = new EventEmitter<void>()

    queryOptions: string[] = []
    queryString: string;
    form: FormGroup;


    myControl = new FormControl(null, Validators.required);
    filteredOptions: Observable<string[]>;

    @ViewChild('mainContainer') public mainContainer: ElementRef<HTMLElement>
    @ViewChild('searchButton') public searchButton: ElementRef<HTMLElement>



    constructor(
        private fb: FormBuilder,
        private cdsService: CdsService,

        private navigationService: NavigationService) { }

    ngOnInit(): void {
        this.cdsService.getAllQueryOptions();
        this.cdsService.queryOptionsEmitter.subscribe((queryOptions: string[]) => {
            this.queryOptions = queryOptions;
            this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value))
            )
        })
    }




    private _filter(value: string): string[] {
        if (value) {
            const filterValue = value.toLowerCase();
            return this.queryOptions.filter(queryOption =>
                queryOption.toLowerCase().includes(filterValue))
        } else {
            return this.queryOptions
        }
    }

    onSearch() {
        if (this.myControl.value) {
            this.queryString = this.myControl.value;
            this.cdsService.getCdsByQueryString(this.myControl.value);
        }
        this.myControl.setValue(null);
        return
    }

    onOptionSelected(option: string) {
        // console.log(option)
        // if (option) {
        //     this.queryString = option;
        //     this.cdsService.getCdsByQueryString(option);
        //     // this.myControl.setValue(null);
        // }
    }

    onClick() {
        console.log('clicked')
    }

    onCloseFilter() {
        this.closeFilter.emit();
        this.cdsService.filterClosedEmitter.emit()
        this.navigationService.filterSelected.emit(false)
    }
    onClearFilter() {
        // this.myControl.setValue(null);
        // this.myControl.markAsPristine({ onlySelf: true });
        // this.myControl.markAsUntouched({ onlySelf: true });
        // this.myControl.updateValueAndValidity();
        this.cdsService.getCdsByQueryString(null)
    }
    onNewFilter() {
        this.queryString = null;
        this.cdsService.getCds();
    }
}
