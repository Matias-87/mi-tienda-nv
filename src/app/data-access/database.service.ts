import { inject, Injectable } from '@angular/core';
import { addDoc, arrayUnion, collection, collectionData, deleteDoc, doc, docData, Firestore, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { SalesSummary, Totals } from '../interfaces/database.interface';
import { from, merge, Observable, tap } from 'rxjs';

const totalsPATH = 'ventas'
const summaryPATH = 'resumen'
const shortDate = new Date().toLocaleDateString().split('/').join('-');
const date = new Date().toLocaleDateString()

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

  async getYears() {
    const docRef = doc(this.firestore, 'resumen', 'years');
    const docSnap = await getDoc(docRef);
    let years: string[] = docSnap.exists() ? docSnap.data()?.['years'] : [];
    return years;
  }

  async getTotalsFilter(month: string, year: string) {
    const daysQuery = query(collection(this.firestore, 'resumen'), where('month', '==', month), where('year', '==', year));
    console.log(month)
    const querySnapshot = await getDocs(daysQuery);

    const results: any[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data())
    })

    return results;
  }

  async addTotal(value: number, type: string) {
    try {
      let longDate = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const venta = {
        total: value,
        timestamp: longDate,
        id: '',
        payment: type
      }
      // let venta: {};

      // switch (type) {
      //   case 'transfer':
      //     venta = {
      //       total: value,
      //       timestamp: longDate,
      //       id: '',
      //       transfer: true
      //     }
      //     break;
      //   case 'outflow':
      //     venta = {
      //       total: value,
      //       timestamp: longDate,
      //       id: '',
      //       outflow: true
      //     }
      //     break;
      //   default:
      //     venta = {
      //       total: value,
      //       timestamp: longDate,
      //       id: ''
      //     }
      //     break;
      // }

      const docRef = await addDoc(this.totalsCollection, venta);

      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    this.addSummary(value, type);
  }

  async addSummary(value: number, type: string) {
    const summaryRef = doc(this.firestore, 'resumen', shortDate);
    const month = shortDate.split('-')[1];
    const year = shortDate.slice(-4);

    const docSnap = await getDoc(summaryRef);
    const salesSummary = docSnap.exists() ? docSnap.data() : {};

    const currentTotal = salesSummary?.['total'] || 0;
    const currentConteo = salesSummary?.['conteo'] || 0;
    const currentOutflow = salesSummary?.['outflow'] || 0;
    const currentTransfer = salesSummary?.['transfer'] || 0;
    const currrentTotalNeto = salesSummary?.['totalNeto'] || 0;
    const currentTrusted = salesSummary?.['trusted'] || 0;
 
    let newValues = {
      total: currentTotal,
      conteo: currentConteo,
      outflow: currentOutflow,
      transfer: currentTransfer,
      totalNeto: currrentTotalNeto,
      trusted: currentTrusted
    }

    // let newTotal = currentTotal
    // let newConteo = currentConteo;
    // let newOutflow = currentOutflow;
    // let newtransfer = currentTransfer;
    // let newtotalNeto = currrentTotalNeto;

    switch (type) {
      case 'outflow':
        newValues.outflow -= value;
        newValues.totalNeto -= value;
        break;
      case 'transfer':
        newValues.total += value;
        newValues.conteo += 1;
        newValues.transfer += value;
        break;
      case 'trusted': 
        newValues.total += value;
        newValues.conteo += 1;
        newValues.trusted += value;
        break;
      default:
        newValues.total += value;
        newValues.conteo += 1;
        newValues.totalNeto += value;
        break;
    }

    // if (type === 'outflow') {
    //   newOutflow -= value;
    //   newtotalNeto -= value;
    // } else if (type === 'transfer') {
    //   newTotal += value;
    //   newConteo += 1;
    //   newtransfer += value;
    //   // newtotalNeto -= value;
    // } else {
    //   newTotal += value;
    //   newConteo += 1;
    //   newtotalNeto += value;
    // }

    // const newTotal = currentTotal + value;
    // let newConteo = currentConteo + 1;

    setDoc(summaryRef, {
      total: newValues.total,
      conteo: newValues.conteo,
      outflow: newValues.outflow,
      transfer: newValues.transfer,
      totalNeto: newValues.totalNeto,
      trusted: newValues.trusted,
      month: month,
      date: date,
      year: year,
    }, { merge: true })

    const years = await this.getYears();

    if (!years.includes(year)) {
      this.addYear(year);
    }
  }

  async addYear(value: string) {
    const yearRef = doc(this.firestore, 'resumen', 'years');

    await setDoc(yearRef, {
      years: arrayUnion(value)
    }, { merge: true })
  }

  async removeSummary(value: number, type: string) {
    const summaryRef = doc(this.firestore, 'resumen', shortDate);

    const docSnap = await getDoc(summaryRef);
    const salesSummary = docSnap.exists() ? docSnap.data() : {};

    const currentTotal = salesSummary?.['total'] || 0;
    const currentConteo = salesSummary?.['conteo'] || 0;
    const currrentTotalNeto = salesSummary?.['totalNeto'] || 0;
    const currentOutflow = salesSummary?.['outflow'] || 0;
    const currentTransfer = salesSummary?.['transfer'] || 0;
    const currentTrusted = salesSummary?.['trusted'] || 0;

    let newValues = {
      total: currentTotal,
      conteo: currentConteo,
      outflow: currentOutflow,
      transfer: currentTransfer,
      totalNeto: currrentTotalNeto,
      trusted: currentTrusted
    }

    // let newTotal = currentTotal;
    // let newConteo = currentConteo;
    // let newtotalNeto = currrentTotalNeto;
    // let newOutflow = currentOutflow;
    // let newtransfer = currentTransfer;

    switch (type) {
      case 'outflow':
        newValues.outflow += value;
        newValues.totalNeto += value;
        break;
      case 'transfer':
        newValues.total -= value;
        newValues.conteo -= 1;
        newValues.transfer -= value;
        break;
      case 'trusted': 
        newValues.total -= value;
        newValues.conteo -= 1;
        newValues.trusted -= value;
        break;
      default:
        newValues.total -= value;
        newValues.conteo -= 1;
        newValues.totalNeto -= value;
        break;
    }

    // if (type === 'outflow') {
    //   newtotalNeto += value;
    //   newOutflow += value;
    // } else if (type === 'transfer') {
    //   newTotal -= value;
    //   newConteo -= 1;
    //   newtransfer -= value;
    // } else {
    //   newTotal -= value;
    //   newConteo -= 1;
    //   newtotalNeto -= value;
    // }
    // const newTotal = currentTotal - value;
    // const newConteo = currentConteo - 1;

    setDoc(summaryRef, {
      total: newValues.total,
      conteo: newValues.conteo,
      totalNeto: newValues.totalNeto,
      outflow: newValues.outflow,
      transfer: newValues.transfer,
      trusted: newValues.trusted
    }, { merge: true })
  }

  async deleteTotal(id: string, total: number, type: string) {
    await deleteDoc(doc(this.firestore, 'ventas', id));
    await this.removeSummary(total, type);
  }

  async deleteCollection(collectionName: string) {
    const collectionRef = collection(this.firestore, collectionName);
    const batchSize = 500;

    while (true) {
      const querySnapshot = await getDocs(query(collectionRef, limit(batchSize)));

      if (querySnapshot.empty) {
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
