import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cd, CdInfo } from 'app/core/interfaces/cd';
import { CdsService } from './../../core/services/cds.service'

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';





@Component({
  selector: 'add-cd',
  templateUrl: './add-cd.component.html',
  styleUrls: ['./add-cd.component.scss']
})
export class AddCdComponent implements OnInit {

  cd: Cd;
  musiciansForm: FormGroup;
  editMode: boolean = false;
  addingTrack: boolean = false;
  addingMusician: boolean = false;
  addingReview: boolean = false;
  addingInfo: boolean = false;
  exportCdToChild: Cd;
  exportCdToChildWithIndex: Object;
  exportMusicianIndex: number;
  oneFormOpened: boolean = false;
  imageUrl: string;
  cdId: string;
  doomedNamesegments: string[] = [
    'van', 'de', 'der', 'op', 'ten', 'het', 'den', 'ter'
  ]
  queryStrings: string[] = []

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cdsService: CdsService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id: string = this.route.snapshot.paramMap.get('id');
    if (id) {
      // EXISTING CD; DATA FROM DB
      this.cdId = id;
      this.editMode = true;
      this.cdsService.getCdById(id)
        .then(cd => {
          this.cd = cd;
          // this.cd.queryStrings = [];
          // this.cd.reviews = [];
          console.log(this.cd)
        })
        .catch(err => console.log(err));
    } else {
      // NO ID, NEW CD
      this.cd = {
        cdInfo: {
          imageUrl: null,
          title: null,
          bandName: null,
          recordingStudio: null,
          recordingEngineer: null,
          mixer: null,
          producer: null,
          publisher: null,
          recordingDate: null,
          price: null,

        },
        tracks: [],
        musicians: [],
        queryStrings: [],
        reviews: []
      }
    }

  }

  // ======= cdInfo ========

  onEditCdInfo() { // START EDITING CDINFO
    if (this.cd) {
      console.log(this.cd)
      // SEND CD TO CHILD
      this.exportCdToChild = this.cd;
    }
    this.oneFormOpened = true;
    this.addingInfo = true;
  }

  // ==========Track=============

  onAddTrack() {
    console.log('adding track');
    if (this.cd) {
      this.exportCdToChild = this.cd
      this.exportCdToChildWithIndex = null;
    }
    this.oneFormOpened = true;
    this.addingTrack = true;
    this.addingReview = false;

  }

  onEditTrack(index: number) {
    console.log('editing track');
    if (this.cd) {
      this.exportCdToChild = null;
      this.exportCdToChildWithIndex = { cd: this.cd, index: index }
    }
    this.oneFormOpened = true;
    this.addingTrack = true
  }

  onDeleteTrack(index) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: 'Are you sure' } })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.cd.tracks.splice(index, 1);
      }
    })
    return;
  }

  // ========== Musician ===============

  onAddMusician() {
    this.oneFormOpened = true;
    if (this.cd) {
      this.exportCdToChild = this.cd;
      this.exportCdToChildWithIndex = null;
    }
    this.addingMusician = true;
    this.addingInfo = false;
    this.addingTrack = false;
    this.addingReview = false;
  }

  onEditMusician(index: number) {
    this.oneFormOpened = true;
    if (this.cd) {
      this.exportCdToChildWithIndex = { cd: this.cd, index: index };
      this.exportCdToChild = null;
    }
    console.log(index);
    this.addingMusician = true;
    this.exportMusicianIndex = index;
  }

  onDeleteMusician(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: 'Are you sure' } });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {

        this.cd.musicians.splice(index, 1);
      }
    })
    return;
  }

  // ========== Review ===============

  onAddReview() {
    if (this.cd) {
      this.exportCdToChild = this.cd
    }
    this.oneFormOpened = true;
    this.addingReview = true;
    this.addingMusician = false;
    this.addingInfo = false;
    this.addingTrack = false;
  }

  onEditReview(index: number) {
    this.oneFormOpened = true;
    console.log(this.cd)
    if (this.cd != undefined) {
      this.exportCdToChildWithIndex = { cd: this.cd, index: index };
      console.log(this.exportCdToChildWithIndex);
      this.exportCdToChild = null
      this.addingReview = true;
    }
  }

  onDeleteReview(index) {
    this.cd.reviews.splice(index, 1)
  }

  // ========= data from child component

  importCdInfoFromChild(cd: Cd) {
    console.log(cd)
    this.cd.cdInfo = cd.cdInfo;
  }

  onAddCdToDb() {
    console.log(this.cd);
    this.cd.musicians.forEach((musician) => {
      const name = musician.name.toLowerCase()
      console.log(name);
      this.cd.queryStrings.push(musician.name.toLowerCase());


      // const nameSegments = musician.name.split(' ')
      // nameSegments.forEach((nameSegment: string) => {
      //     console.log(nameSegment)
      //     if((this.doomedNamesegments.indexOf(nameSegment) === -1)) {
      //         console.log(nameSegment);
      //         this.cd.queryStrings.push(nameSegment);
      //     }
      // })
    })
    this.cd.queryStrings.push(this.cd.cdInfo.bandName.toLowerCase());
    this.cd.queryStrings.push(this.cd.cdInfo.title.toLowerCase());
    console.log(this.cd.queryStrings);
    if (this.editMode) {
      console.log('save edits', this.cd);
      this.cdsService.editCd(this.cd)
        .then(res => {
          console.log(res)
          this.router.navigate(['cds']);

          this.clearAll()

        })
        .catch(err => console.log(err));
    } else {
      console.log('save new cd', this.cd)
      this.cdsService.addCd(this.cd)
        .then(res => {
          console.log(res)
          this.clearAll()
          this.router.navigate(['cds']);
        })
        .catch(err => console.log(err));
    }
  }

  onCancelAddCdToDb() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure? this will clear the whole form!' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // TODO CLEAR ALL FORMS
        this.clearAll()

      }
    })
  }


  closeFormsInParent() {
    this.oneFormOpened = false;
    this.addingInfo = false;
    this.addingTrack = false;
    this.addingMusician = false;
    this.addingReview = false;
  }

  private clearAll() {
    this.cd = null;
    this.router.navigate(['cds']);
  }

  // importCdFromChild(cd: Cd) { // AFTER ADD-CDINFO, ADD-TRACKS OR ADD-MUSICIANS IS CLOSED
  //     if(cd) {
  //         console.log('cd from child: ', cd)
  //         this.cd = cd;
  //     }
  //     console.log(this.cd);
  //     this.oneFormOpened = false;
  //     this.addingInfo = false;
  //     this.addingTrack = false;
  //     this.addingMusician = false;
  // }
}
