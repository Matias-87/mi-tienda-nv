import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-sales-btn',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './sales-btn.component.html',
  styleUrl: './sales-btn.component.scss'
})
export class SalesBtnComponent {

  modalChange: string = 'modal-hidden';
  salesBtn: string = 'sales-btn';
  totalPrice: string = '';
  modalClass: boolean = false;

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

  @Output() addNum = new EventEmitter<string>();

  numValue(value: string) {
    if (value !== '') {
      this.addNum.emit(value);
      this.changeClass();
    }
  }
}
