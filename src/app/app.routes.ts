import { Routes } from '@angular/router';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesSummaryComponent } from './sales-summary/sales-summary.component';
import { animation } from '@angular/animations';
import { NavLayoutComponent } from './nav-layout/nav-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'sign-up',
                loadComponent: () => import('./auth/sign-up/sign-up.component').then(c => c.SignUpComponent),
            },
            {
                path: 'log-in',
                loadComponent: () => import('./auth/log-in/log-in.component').then(c => c.LogInComponent),
            }
        ]
    },
    { path: '', redirectTo: '/home-page', pathMatch: 'full' },
    {
        path: '',
        component: NavLayoutComponent,
        children: [
            { path: 'home-page', component: SalesListComponent, data: { animation: 'home-page' } },
            { path: 'sales-summary', component: SalesSummaryComponent, data: { animation: 'sales-summary' } }
        ]
    },
    { path: '**', redirectTo: '/home-page' },
];