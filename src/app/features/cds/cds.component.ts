import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Cd } from 'app/core/interfaces/cd';
import { CdsService } from 'app/core/services/cds.service';
import { CheckoutService } from './../checkout/checkout.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component'
import { CdDialogComponent } from './cd-dialog/cd-dialog.component';

@Component({
    selector: 'cds',
    templateUrl: './cds.component.html',
    styleUrls: ['./cds.component.scss']
})
export class CdsComponent implements OnInit {


    cds$: Observable<Cd[]>;
    isAdmin: boolean = false;
    


    constructor(
        private cdsService: CdsService,
        private router: Router,
        private afAuth: AngularFireAuth,
        private checkoutService: CheckoutService,
        private authService: AuthService,
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        
        this.authService.isAdmin.subscribe((isAdmin: boolean) => {
            this.isAdmin = isAdmin;
            console.log(this.isAdmin)
        })
        this.cds$ = this.cdsService.getCds();


        this.afAuth.user.subscribe(user => {
            if(user) {
                console.log(user.uid);
                if (user.uid === 'OsZTBYWyXnQQ7rzN0TIoAByDSCI3') {
                    this.isAdmin = true
                    console.log(user.uid, this.isAdmin);
                }
            }
        })
    }

    reloadCds() {
    }

    onEdit(id: string) {
        console.log(id);
        // const stringifiedCd = JSON.stringify(id)
        this.router.navigate(['/cds/add-cd', { id }]);
    }

    onDelete(id: string) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {data: {message: 'Are you sure?'}});
        dialogRef.afterClosed().subscribe((data) => {
            if(data) {
                console.log(id);
                this.cdsService.deleteCd(id)
            }
        });
        // .then(res => console.log(res))
        // .catch(err => console.log(err));
    }
    onAddNewCd() {
        this.router.navigate(['/cds/add-cd'])
    }
    onAddCdToCart(cd) {
        this.checkoutService.addCdToCart(cd)
    }
    onCdInfo(cd) {
        console.log(cd);
        this.dialog.open(CdDialogComponent, {
            width: '25rem',
            data: {cd},
            autoFocus: false,
            maxHeight: '90vh',
            
        })
    }
}
