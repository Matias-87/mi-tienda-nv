import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DatabaseService } from '../data-access/database.service';
import { fadeInOutAnimation } from '../../animations/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-btn',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './sales-btn.component.html',
  styleUrl: './sales-btn.component.scss',
  animations: [fadeInOutAnimation]
})
export class SalesBtnComponent {
  private _databaseService = inject(DatabaseService);

  modalChange: string = 'modal-hidden';
  // modalChange = 'modal'
  modalChangeEndDay: string = 'modal-hidden';
  salesBtn: string = 'sales-btn';
  endBtn: string = 'end-btn'
  totalPrice: string = '';
  modalClass: boolean = false;
  modalClassEndDay: boolean = false;
  paymentValue: string = 'cash';

  async addTotals(value: number) {
    try {
      this.changeClass();
      await this._databaseService.addTotal(value, this.paymentValue);
    } catch (error) {
      console.error(error);
      this.changeClass();
    }
  }

  async endDay() {
    await this._databaseService.deleteCollection('ventas');
    this.changeClassEndDay();
  }

  changeClass(): void {
    if (this.modalClass) {
      this.modalChange = 'modal-hidden';
      // this.modalClass = false;
    } else {
      this.modalChange = 'modal';
      this.totalPrice = '';
      this.paymentValue = 'cash'
    }

    this.modalClass = !this.modalClass;
  }

  changeClassEndDay(): void {
    if (this.modalClass) {
      this.modalChangeEndDay = 'modal-hidden';
    } else {
      this.modalChangeEndDay = 'modal';
    }

    this.modalClassEndDay = !this.modalClassEndDay
  }
}
