import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AudioStorageService {

  constructor(private storage: AngularFireStorage) { }

  uploadAudio(idPaciente, idRelato, blob) {
    return this.storage.upload(idPaciente + '/' + idRelato, blob);
  }

  getRelatoAudio(idPaciente, idRelato) {
    return this.storage.ref(idPaciente + '/' + idRelato).getDownloadURL();
  }

}
