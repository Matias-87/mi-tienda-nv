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
  salesSummary$: number | undefined;
  outflowsSummary$: number | undefined;
  transferSummary$: number | undefined;
  trustedSummary$: number | undefined;
  totalNeto$: number | undefined;

  async ngOnInit(): Promise<void> {
    this.getSalesSummarySubscription = this._databaseService.getSalesSummary().subscribe((data) => {
      this.salesSummary$ = data?.total;
      this.outflowsSummary$ = data?.outflow;
      this.transferSummary$ = data?.transfer;
      this.trustedSummary$ = data?.trusted;
      this.totalNeto$ = data?.totalNeto;
    })
    console.log(this.totals$)
  }

  ngOnDestroy(): void {
    this.getSalesSummarySubscription?.unsubscribe();
  }

  async deleteTotal(id: string, total: number, type: string) {
    console.log(id);
    try {
      await this._databaseService.deleteTotal(id, total, type);
    } catch (error) {
      console.error('The Deletion Failed', error);
    }
  }
}
