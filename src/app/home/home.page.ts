import { Platform, ToastController, IonList } from '@ionic/angular';
import { Component, ViewChild } from '@angular/core';
import { StorageService, Item } from '../services/storage.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: Item[] = [];
  newItem: Item = <Item>{};
  @ViewChild('myList',{static: true})myList: IonList;
  constructor(
    private storageService: StorageService,
    private plt: Platform,
    private toastController: ToastController
  ) {
    this.plt.ready().then( () => {
      this.loadItems();
    })
  }

  addItem() {
    this.newItem.modified = Date.now();
    this.newItem.id = Date.now();
    this.storageService.addItem(this.newItem).then(item => {
      this.newItem = <Item>{};
      this.showToast('Item added!!');
      this.loadItems();
    })
  }
  loadItems() {
    this.storageService.getItems().then( items => {
      this.items = items;
    })
  }
  updateItem(item: Item) {
    item.title = `UPDATED: ${item.title}`;
    item.modified = Date.now();
    this.storageService.updateItem(item).then( item => {
      this.showToast('Item updated!');
    })
  }

  deleteItem(item: Item) {
    this.storageService.deleteItem(item.id).then(item => {
      this.showToast('Item removed!!');
      this.myList.closeSlidingItems();
      this.loadItems();
    })
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
