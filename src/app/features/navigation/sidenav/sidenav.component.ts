import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Customer } from 'app/core/interfaces/customer';
import { AuthService } from 'app/features/auth/auth.service';

@Component({
    selector: 'sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    customer: Customer;

    constructor(
        private authService: AuthService,
        private afAuth: AngularFireAuth
    ) { }

    @Output() closeSidenav = new EventEmitter<void>();

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
    }

    onClose() {
        this.closeSidenav.emit();
    }
    onLogout() {
        this.authService.logout();
        this.closeSidenav.emit();
    }
}
