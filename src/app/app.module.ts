


// import { AboutComponent } from './about/about.component';



import { AddCdComponent } from './features/add-cd/add-cd.component';
import { AddCdInfoComponent } from './features/add-cd/add-cd-info/add-cd-info.component';
import { AddMusicianComponent } from './features/add-cd/add-musician/add-musician.component'
import { AddTracksComponent } from './features/add-cd/add-tracks/add-tracks.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app-material.module'
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { CheckUserDataComponent } from './features/check-user-data/check-user-data.component';
import { ConfirmationDialogComponent } from './features/confirmation-dialog/confirmation-dialog.component';
import { CustomerComponent } from './features/customer/customer.component';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './../app/features/navigation/header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginPageDialogComponent } from './features/auth/login-page-dialog/login-page-dialog.component';
import { NgModule } from '@angular/core';
import { SidenavComponent } from './features/navigation/sidenav/sidenav.component';
import { SignupPageDialogComponent } from './features/auth/signup-page-dialog/signup-page-dialog.component';
import { StripeCheckoutComponent } from './stripe-checkout/stripe-checkout.component';
import { PickUpInfoDialogComponent } from './features/checkout/pick-up-info-dialog/pick-up-info-dialog.component';
import { FilterComponent } from './features/filter/filter.component';




@NgModule({
  declarations: [
    AppComponent,    
    AddCdComponent,
    AddCdInfoComponent,
    AddMusicianComponent,
    AddTracksComponent,
    CheckoutComponent,
    CheckUserDataComponent,
    ConfirmationDialogComponent,
    CustomerComponent,
    HeaderComponent,
    LoginPageDialogComponent,
    SidenavComponent,
    SignupPageDialogComponent,
    StripeCheckoutComponent,
    PickUpInfoDialogComponent,
    FilterComponent,
    


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    HttpClientModule,
    AppMaterialModule
  ],
  providers: [
    // CourseResolver,
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
