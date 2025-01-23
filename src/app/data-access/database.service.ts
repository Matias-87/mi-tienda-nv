import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc, writeBatch } from '@angular/fire/firestore';
import { SalesSummary, Totals } from '../interfaces/database.interface';
import { from, merge, Observable } from 'rxjs';

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

  getSalesSummary() {
    const docRef = doc(this.firestore, 'resumen', shortDate);
    return docData(docRef, { idField: 'id' }) as Observable<SalesSummary | null>;
  }

  async addTotal(value: number) {
    try {
      const longDate = new Date().toLocaleTimeString();
      const venta = {
        total: value,
        timestamp: longDate,
        id: ''
      }

      const docRef = await addDoc(this.totalsCollection, venta);

      await updateDoc(docRef, {id: docRef.id});
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    this.addSummary(value);
  }

  async addSummary(value: number) {
    const summaryRef = doc(this.firestore, 'resumen', shortDate.split('T')[0]);

    const docSnap = await getDoc(summaryRef);
    const salesSummary = docSnap.exists() ? docSnap.data() : {};

    const currentTotal = salesSummary?.['total'] || 0;
    const currentConteo = salesSummary?.['conteo'] || 0;

    const newTotal = currentTotal + value;
    const newConteo = currentConteo + 1;

    setDoc(summaryRef, { total: newTotal, conteo: newConteo }, { merge: true })
  }

  async removeSummary(value: number) {
    const summaryRef = doc(this.firestore, 'resumen', shortDate.split('T')[0]);

    const docSnap = await getDoc(summaryRef);
    const salesSummary = docSnap.exists() ? docSnap.data() : {};

    const currentTotal = salesSummary?.['total'] || 0;
    const currentConteo = salesSummary?.['conteo'] || 0;

    const newTotal = currentTotal - value;
    const newConteo = currentConteo - 1;

    setDoc(summaryRef, { total: newTotal, conteo: newConteo }, { merge: true })
  }

  async deleteTotal(id: string, total: number) {
    await deleteDoc(doc(this.firestore, 'ventas', id));
    await this.removeSummary(total);
  }

  async deleteCollection(collectionName: string) {
    const collectionRef = collection(this.firestore, collectionName);
    const batchSize = 500;

    while(true) {
      const querySnapshot = await getDocs(query(collectionRef, limit(batchSize)));

      if(querySnapshot.empty) {
        break;
      }

      const batch = writeBatch(this.firestore);

      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    }
  }
}
