import { Routes } from '@angular/router';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesSummaryComponent } from './sales-summary/sales-summary.component';

export const routes: Routes = [
    { path: 'home-page', component: SalesListComponent },
    { path: 'sales-summary', component: SalesSummaryComponent },
    { path: '**', component: SalesListComponent },
    { path: '', redirectTo: '/home-page', pathMatch: 'full' },
];