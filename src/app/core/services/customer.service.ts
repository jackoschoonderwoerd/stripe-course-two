import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer } from '../interfaces/customer';
import { first, map } from 'rxjs/operators';
import { merge } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customer: Customer;
  

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  addCustomerDataToDb(uid, customer: Customer) {
    return this.db.collection('customers').doc(uid).set(customer)
  }

  updateCustomer(uid: string, customer: Customer) {
    return this.db.collection('customers').doc(uid).update(customer)
  }

  getCustomerByUid(uid) {
    if (uid) {
      const customer = this.db
        .collection('customers')
        .doc(uid)
        .valueChanges()
        .pipe(first())
        .pipe(
          map((customer: Customer) => {
            this.customer = customer
            return customer
          })
        );
      return customer
    } else {
      console.log('no customer');
      return null
    }
  }

  getCustomer():Customer{
    return this.customer;
  }


}
