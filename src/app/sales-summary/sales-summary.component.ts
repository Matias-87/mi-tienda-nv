import { Component, inject, OnInit } from '@angular/core';
import { DatabaseService } from '../data-access/database.service';

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

@Component({
  selector: 'app-sales-summary',
  standalone: true,
  imports: [],
  templateUrl: './sales-summary.component.html',
  styleUrl: './sales-summary.component.scss'
})
export class SalesSummaryComponent implements OnInit {
  private _databaseService = inject(DatabaseService);

  monthsArr = months;
  result: any;

  async ngOnInit(): Promise<void> {
    this.result = await this._databaseService.getTotalsFilter('1');
    console.log(this.result);
  }
}
