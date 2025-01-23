import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DatabaseService } from '../data-access/database.service';
import { AsyncPipe } from '@angular/common';
import { SalesBtnComponent } from '../sales-btn/sales-btn.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [AsyncPipe, SalesBtnComponent],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss'
})
export class SalesListComponent implements OnInit, OnDestroy {
  private getSalesSummarySubscription?: Subscription;

  private _databaseService = inject(DatabaseService);

  totals$ = this._databaseService.getTotals();
  salesSummary$: any;

  async ngOnInit(): Promise<void> {
    this.getSalesSummarySubscription = this._databaseService.getSalesSummary().subscribe((data) => {
      this.salesSummary$ = data;
    })
  }

  ngOnDestroy(): void {
    this.getSalesSummarySubscription?.unsubscribe();
  }

  async addTotals(value: number) {
    try {
      await this._databaseService.addTotal(value);
      // this.salesSummary$ = await this._databaseService.getSalesSummary();
    } catch (error) {
      console.error(error);
    }
    console.log(this.salesSummary$);
    // this.salesSummary$ = this._databaseService.getSalesSummary();
  }

  async deleteTotal(id: string, total: number) {
    console.log(id);
    try {
      await this._databaseService.deleteTotal(id, total);
    } catch (error) {
      console.error('The Deletion Failed', error);
    }
  }

}
