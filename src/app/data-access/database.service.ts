import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDoc, orderBy, query, setDoc } from '@angular/fire/firestore';
import { SalesSummary, Totals } from '../interfaces/database.interface';
import { from, Observable } from 'rxjs';

const totalsPATH = 'ventas'
const summaryPATH = 'resumen'
const shortDate = new Date().toLocaleDateString().split('/').join('-');

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore: Firestore = inject(Firestore);
  private totalsCollection = collection(this.firestore, totalsPATH);
  private salesSummaryCollection = collection(this.firestore, summaryPATH)

  venta = doc(collection(this.firestore, totalsPATH));

  getTotals() {
    const totalsQuery = query(this.totalsCollection, orderBy('timestamp', 'asc'))
    return collectionData(totalsQuery) as Observable<any[]>;
  }

  async getSalesSummary() {
    const longDate = new Date().toLocaleTimeString();
    const docRef = doc(this.firestore, 'resumen', shortDate);
    // return from(getDoc(docRef).then(docSnap => docSnap.exists() ? (docSnap.data() as SalesSummary) : null))
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
      console.log(docSnap.data(), shortDate, longDate);
      return docSnap.data() as SalesSummary;
    } else {
      console.log('The Document does not exist');
      return;
    }
  }

  async addTotal(value: number) {
    const longDate = new Date().toLocaleTimeString();
    const venta = {
      total: value,
      timestamp: longDate
    }

    addDoc(this.totalsCollection, venta);

    await this.addSummary(value);
  }

  async addSummary(value: number) {
    const summaryRef = doc(this.firestore, 'resumen', shortDate.split('T')[0]);
    const summary = await this.getSalesSummary();

    const currentTotal = summary?.total || 0;
    const currentConteo = summary?.conteo || 0;

    const newTotal = currentTotal + value;
    const newConteo = currentConteo + 1;

    setDoc(summaryRef, { total: newTotal, conteo: newConteo }, { merge: true })
  }
}
