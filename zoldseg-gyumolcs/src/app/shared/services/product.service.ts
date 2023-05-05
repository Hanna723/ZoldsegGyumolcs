import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  collectionName = 'Products';

  constructor(private angularFirestore: AngularFirestore, private storage: AngularFireStorage) {}

  create(product: Product) {
    return this.angularFirestore
      .collection<Product>(this.collectionName)
      .add(product);
  }

  getAll() {
    return this.angularFirestore
      .collection<Product>(this.collectionName)
      .valueChanges();
  }

  getById(id: string) {
    return this.angularFirestore
      .collection<Product>(this.collectionName)
      .doc(id)
      .valueChanges();
  }

  getImage(url: string) {
    return this.storage.ref(url).getDownloadURL();
  }

  update(product: Product, id: string) {
    this.angularFirestore
      .collection<Product>(this.collectionName)
      .doc(id)
      .set(product);
  }

  delete(id: string) {
    return this.angularFirestore
      .collection<Product>(this.collectionName)
      .doc(id)
      .delete();
  }
}
