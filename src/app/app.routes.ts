import { Routes } from '@angular/router';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesSummaryComponent } from './sales-summary/sales-summary.component';
import { animation } from '@angular/animations';

export const routes: Routes = [
    { path: 'home-page', component: SalesListComponent, data: { animation: 'home-page' } },
    { path: 'sales-summary', component: SalesSummaryComponent, data: { animation: 'sales-summary' } },
    { path: '**', component: SalesListComponent },
    { path: '', redirectTo: '/home-page', pathMatch: 'full' },
];