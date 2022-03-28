import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CdsComponent } from './cds.component';
import { AddCdComponent } from './../add-cd/add-cd.component'

const routes: Routes = [
    {
        path: "",
        component: CdsComponent
    },
    {
        path: 'add-cd',
        component: AddCdComponent
    },
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CdsRoutingModule { }
