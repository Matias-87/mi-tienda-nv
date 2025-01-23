import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../data-access/database.service';

@Component({
  selector: 'app-sales-btn',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './sales-btn.component.html',
  styleUrl: './sales-btn.component.scss'
})
export class SalesBtnComponent {
  private _databaseService = inject(DatabaseService);

  modalChange: string = 'modal-hidden';
  salesBtn: string = 'sales-btn';
  totalPrice: string = '';
  modalClass: boolean = false;

  async addTotals(value: number) {
    try {
      this.changeClass();
      await this._databaseService.addTotal(value);
    } catch (error) {
      console.error(error);
      this.changeClass();
    }
  }

  async endDay() {
    await this._databaseService.deleteCollection('ventas')
  }

  changeClass(): void {
    if (this.modalClass) {
      this.modalChange = 'modal-hidden';
      this.salesBtn = 'sales-btn'
      this.modalClass = false;
    } else {
      this.modalChange = 'modal';
      this.salesBtn = 'modal-hidden';
      this.totalPrice = '';
      this.modalClass = true;
    }
  }
}
