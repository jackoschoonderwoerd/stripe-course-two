// 09.01 create checkout.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutSession } from '../model/checkout-session.model'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, first } from 'rxjs/operators';
import { environment } from 'environments/environment';

// 20.05 declare the global object created in index.html
declare const Stripe;


@Injectable({
  providedIn: 'root'
})

export class StripeCheckoutService {

  private jwtAuth: string;

  constructor(
    // 09.02 add httpclient
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) {

    afAuth.idToken.subscribe(jwt => this.jwtAuth = jwt);
  }

  // 09.03 create startCourseCheckoutSession() (baseUrl = "")
  
  startCourseCheckoutSession(courseId: string): Observable<CheckoutSession> {
    console.log(this.jwtAuth);
    // 20.02 returning observable checkoutsession
    // 26.01 add the jwt to the authorization header
    const headers = new HttpHeaders().set("Authorization", this.jwtAuth);
    // 09.08 this request needs to point to our own created server. When we run 'npm start', the server will automaically start on port 9000. (./proxy.json). Initialization of stripe-checkout-session needs to be done from a secured place => our own server
    return this.http.post<CheckoutSession>(environment.api.baseUrl + "/api/checkout", {
      courseId: courseId,
      callbackUrl: this.buildCallbackUrl()
    }, { headers })
  }

  // startSubscriptionCheckoutSession(pricingPlanId: string): Observable<CheckoutSession> {
  //   const headers = new HttpHeaders().set("Authorization",  this.jwtAuth);
  //   console.log(pricingPlanId);
 

  //   return this.http.post<CheckoutSession>(environment.api + "/api/checkout", {
  //     pricingPlanId,
  //     callbackUrl: this.buildCallbackUrl()
  //   }, { headers })
  // }
  // 18.04 buildCallbackUrl(); constructs callbackUrl. this url gets sent to the backend
  buildCallbackUrl() {
    // 18.05 protocol : http or https
    const protocol = window.location.protocol,
    // 18.06 hostname : i.e. localhost, jazzengel.nl
      hostname = window.location.hostname,
      // 18.07 port: i.e 4200
      port = window.location.port
    let callbackUrl = `${protocol}//${hostname}`;

    if (port) {
      callbackUrl += ':' + port;
    }
    callbackUrl += "/stripe-checkout";
    console.log('[COS 69] callbackUrl: ', callbackUrl);
    return callbackUrl;
  }
 // 20.06 
  redirectToCheckout(session: CheckoutSession) {
    console.log('[COS 74], session', session);
    const stripe = Stripe(session.stripePublicKey);
    stripe.redirectToCheckout({
      sessionId: session.stripeCheckoutSessionId
    })
  }

  // waitForPurchaseCompleted(ongoingPurchaseSessionId: string) {
  waitForPurchaseCompleted(ongoingPurchaseSessionId: string): Observable<any> {
    console.log(ongoingPurchaseSessionId);
    return this.afs.doc<any>(`purchaseSessions/${ongoingPurchaseSessionId}`)
      .valueChanges()
      
      .pipe(
        filter(purchase => purchase.status == "completed"),
        first()
      )
      
  }
}
