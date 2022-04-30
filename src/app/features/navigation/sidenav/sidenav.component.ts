import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Customer } from 'app/core/interfaces/customer';
import { AuthService } from 'app/features/auth/auth.service';
import { User } from 'firebase';
import { NavigationService } from './../navigation.service'

@Component({
    selector: 'sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    customer: Customer;
    
    @Output() closeSidenav = new EventEmitter<void>();

    constructor(
        private authService: AuthService,
        private afAuth: AngularFireAuth,
        private navigationService: NavigationService
    ) { }


    ngOnInit(): void {
        this.afAuth.user.subscribe((user => {
            if(user) {
                this.authService.getCustomer(user.uid).subscribe((customer: Customer) => {
                    this.customer = customer;
                    // console.log(this.customer)
                })
            } else {
                console.log('no user');
            }

        }))
        this.authService.customerChanged.subscribe((customer: Customer) => {
            if(!customer) {
                this.customer = null
            }
            return;
        })
    }

    onClose() {
        this.closeSidenav.emit();
    }
    onLinkSelected(e) {
        if(e.target.outerText.toLowerCase() === 'cds') {
            this.navigationService.cdsViewOptionsVisible.emit(true);
        } else {
            this.navigationService.cdsViewOptionsVisible.emit(false);
        }    
        this.onClose()
    }

    onLogout() {
        this.authService.logout();
        this.closeSidenav.emit();
    }
}
