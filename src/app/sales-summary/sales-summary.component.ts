import { Component, inject, OnInit } from '@angular/core';
import { DatabaseService } from '../data-access/database.service';
import { SalesSummary } from '../interfaces/database.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, filter } from 'rxjs';

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

@Component({
  selector: 'app-sales-summary',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sales-summary.component.html',
  styleUrl: './sales-summary.component.scss'
})
export class SalesSummaryComponent implements OnInit {
  private _databaseService = inject(DatabaseService);
  private formBuilder = inject(FormBuilder);

  filterForm = this.formBuilder.group({
    monthFilter: [''],
    yearFilter: ['']
  })
  
  monthsArr = months;
  result: any;
  monthTotal: number = 0;
  monthOutflow: number = 0;
  monthNeto: number = 0;
  monthTrusted: number = 0;
  monthTransfer: number = 0;
  years: string[] = [];

  async ngOnInit(): Promise<void> {
    this.years = await this._databaseService.getYears();

    combineLatest([
      this.filterForm.get('monthFilter')!.valueChanges,
      this.filterForm.get('yearFilter')!.valueChanges
    ]).subscribe(([monthFilter, yearFilter]) => {
      if (monthFilter && yearFilter) {
        this.applyFilters(monthFilter, yearFilter);
      }
    })
  }

  async applyFilters(month: string, year: string) {
    this.result = await this._databaseService.getTotalsFilter(month, year);
    this.monthTotal = this.result.reduce((acc: number, val: SalesSummary) => acc + val.total, 0);
    this.monthOutflow = this.result.reduce((acc: number, val: SalesSummary) => acc + val.outflow, 0);
    this.monthNeto = this.result.reduce((acc: number, val: SalesSummary) => acc + val.totalNeto, 0);
    this.monthTrusted = this.result.reduce((acc: number, val: SalesSummary) => acc + val.trusted, 0); 
    this.monthTransfer = this.result.reduce((acc: number, val: SalesSummary) => acc + val.transfer, 0);
  }
}
