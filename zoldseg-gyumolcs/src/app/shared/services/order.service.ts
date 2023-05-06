import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Order } from '../models/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  collectionName = 'Orders';

  constructor(private angularFirestore: AngularFirestore) {}

  create(order: Order) {
    return this.angularFirestore
      .collection<Order>(this.collectionName)
      .add(order);
  }

  getAll(userId: string) {
    return this.angularFirestore
      .collection<Order>(this.collectionName, (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges();
  }
}
