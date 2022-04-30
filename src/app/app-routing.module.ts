import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { CheckoutComponent } from './features/checkout/checkout.component';
import { CustomerComponent } from './features/customer/customer.component';
import { CheckUserDataComponent } from './features/check-user-data/check-user-data.component'
import { StripeCheckoutComponent } from './stripe-checkout/stripe-checkout.component';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
    // {
    //     path: "",
    //     loadChildren: () => 
    //     import('./features/cds/cds.module').then(m => m.CdsModule)

    // },
    {
        path: "",
        redirectTo: 'home',
        pathMatch: "full"
    },
    {
        path: 'home', 
        component: HomeComponent
    },
    {
        path: "cds", 
        loadChildren: () => 
        import('./features/cds/cds.module').then(m => m.CdsModule)
    },
    {
        path: "customer",
        component: CustomerComponent
    },
    {
        path: 'check-user-data',
        component: CheckUserDataComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    {
        path:"stripe-checkout",
        component: StripeCheckoutComponent
      },
    {
        path: "**",
        redirectTo: '/'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
