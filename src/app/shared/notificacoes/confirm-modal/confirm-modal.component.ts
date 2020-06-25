import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-notificacao-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  modalHeight: number;

  title: string;
  description: string;
  yesButton: string;
  noButton: string;
  yesButtonMatColor: string;

  constructor(public dialogRef: MatDialogRef<ConfirmModalComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    console.log(data);
    this.modalHeight = data.modalHeight;
    this.title = data.title;
    this.description = data.description;
    this.yesButton = data.yesButton;
    this.noButton = data.noButton;
    this.yesButtonMatColor = data.yesButtonMatColor;
  }

  ngOnInit(): void {
  }

  onCloseClicked(response) {
    this.dialogRef.close(response);
  }

  getModalStyle() {
    return (this.modalHeight - 48).toString() + 'px';
  }
}
