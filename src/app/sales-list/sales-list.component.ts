import { Component, inject } from '@angular/core';
import { DatabaseService } from '../data-access/database.service';
import { AsyncPipe } from '@angular/common';
import { SalesBtnComponent } from '../sales-btn/sales-btn.component';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [AsyncPipe, SalesBtnComponent],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss'
})
export class SalesListComponent {
  private _databaseService = inject(DatabaseService);

  totals$ = this._databaseService.getTotals();
  salesSummary$: any;

  async ngOnInit(): Promise<void> {
    this.salesSummary$ = await this._databaseService.getSalesSummary();
  }

  async addTotals(value: number) {
    try {
      await this._databaseService.addTotal(value);
      this.salesSummary$ = await this._databaseService.getSalesSummary();
    } catch (error) {
      console.error(error);
    }
    console.log(this.salesSummary$);
    // this.salesSummary$ = this._databaseService.getSalesSummary();
  }

}
