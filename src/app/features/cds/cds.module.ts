import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdsComponent } from './cds.component';
import { CdsRoutingModule } from './cds-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { CdsMaterialModule } from './cds-material.module';
import { CdDialogComponent } from './cd-dialog/cd-dialog.component';
import { TwoDecimalPipe } from 'app/core/pipes/two-decimal.pipe';
import { CapitalizeNamePipe } from 'app/core/pipes/capitalizeName.pipe';



@NgModule({
  declarations: [
    CdsComponent,
    CdDialogComponent,
    TwoDecimalPipe,
    CapitalizeNamePipe
   
  ],
  imports: [
    CommonModule,
    CdsRoutingModule,
    ReactiveFormsModule,
    CdsMaterialModule
  ]
})
export class CdsModule { }
