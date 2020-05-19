import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  title = 'whatshappy';
  items: Observable<any[]>;
  saveTest;
  editando;
  edit;
  itemsCol: AngularFirestoreCollection;
  constructor(firestore: AngularFirestore) {
    this.itemsCol = firestore.collection('items');
    this.items = firestore.collection('items').valueChanges({ idField: 'id' });
  }

  save() {
    const obj = {
      name: this.saveTest
    };
    this.itemsCol.add(obj).then((result) => {
      this.saveTest = '';
    }).catch((err) => {
    });
  }
  ngOnInit() {

  }

  editar(item) {
    this.itemsCol.doc(item.id).update({
      name: this.edit
    }).then((result) => {
      this.editando = undefined;
      this.saveTest = '';
    }).catch((err) => {
    });

  }

  deletar(item) {
    this.itemsCol.doc(item.id).delete();
  }
}
