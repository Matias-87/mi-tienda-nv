import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Interface } from 'readline';
import { Observable } from 'rxjs';

const PATH = 'totals';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  private firestore: Firestore = inject(Firestore);
  private totalsCollection = collection(this.firestore, PATH);

  getTotals() {
    return collectionData(this.totalsCollection) as Observable<Totals[]>;
  }

  totals$ = this.getTotals();

  async addTotals(value: number) {
    try {
      await addDoc(this.totalsCollection, {total: value});
    } catch (error) {
      console.error(error);
    }
  }
}

export interface Totals {
  total: number;
  id: string;
}
