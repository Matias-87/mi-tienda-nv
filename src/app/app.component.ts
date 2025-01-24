import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Interface } from 'readline';
import { Observable } from 'rxjs';
import { DatabaseService } from './data-access/database.service';
import { SalesSummary } from './interfaces/database.interface';
import { SalesListComponent } from "./sales-list/sales-list.component";
import { SalesBtnComponent } from "./sales-btn/sales-btn.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';

const PATH = 'totals';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  // private _databaseService = inject(DatabaseService);

  // totals$ = this._databaseService.getTotals();
  // salesSummary$: any;

  // async ngOnInit(): Promise<void> {
  //   this.salesSummary$ = await this._databaseService.getSalesSummary();
  // }

  // async addTotals(value: number) {
  //   try {
  //     await this._databaseService.addTotal(value);
  //     this.salesSummary$ = await this._databaseService.getSalesSummary();
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   console.log(this.salesSummary$);
  //   // this.salesSummary$ = this._databaseService.getSalesSummary();
  // }
}
