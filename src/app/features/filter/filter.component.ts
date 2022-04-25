// import { Component, OnInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';

// /**
//  * @title Highlight the first autocomplete option
//  */
// @Component({
//     selector: 'filter',
//     templateUrl: './filter.component.html',
//     styleUrls: ['./filter.component.scss']
// })
// export class FilterComponent implements OnInit {
//     myControl = new FormControl();
//     options: string[] = ['One', 'Two', 'Three'];
//     filteredOptions: Observable<string[]>;

//     ngOnInit() {
//         this.filteredOptions = this.myControl.valueChanges.pipe(
//             startWith(''),
//             map(value => this._filter(value)),
//         );
//     }

//     private _filter(value: string): string[] {
//         const filterValue = value.toLowerCase();

//         return this.options.filter(option => option.toLowerCase().includes(filterValue));
//     }
// }

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdsService } from 'app/core/services/cds.service';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    options: string[] = ['angular', 'react', 'view'];
    
    @Output() closeFilter = new EventEmitter<void>()

    // form: FormGroup;
    queryOptions: string[] = []
    
    // objectOptions = [
    //     {name: 'angular'},
    //     {name: 'angular material'},
    //     {name: 'react'},
    //     {name: 'Vue'},
    // ]

    myControl = new FormControl();
    filteredOptions: Observable<string[]>;

    constructor(
        private fb: FormBuilder,
        private cdsService: CdsService) { }

    ngOnInit(): void {
        // this.initForm();
        this.cdsService.getAllQueryOptions();
        this.cdsService.queryOptionsEmitter.subscribe((queryOptions: string[]) => {
            this.options = queryOptions;
            console.log(this.queryOptions);
            this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value))
            )
        } )
    }


    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => 
            option.toLowerCase().includes(filterValue))
    }

    onSearch() {
        if(this.myControl.value) {
            this.cdsService.getCdsByQueryString(this.myControl.value);
        }
        return
    }

    onCloseFilter() {
        this.closeFilter.emit();
    }
    onOptionChanged() {
        console.log(this.myControl.value)
    }
}
