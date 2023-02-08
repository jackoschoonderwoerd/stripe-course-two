import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  @Output() cdsViewOptionsVisible = new EventEmitter<boolean>();
  @Output() showFilter = new EventEmitter<boolean>();
  @Output() filterSelected = new EventEmitter<boolean>();


  constructor() { }


}
