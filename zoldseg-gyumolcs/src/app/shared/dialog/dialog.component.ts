import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @Output() deleteEvent = new EventEmitter<string>();
  link = this.data.title == 'Registration succesful!' ? '/auth/login' : '';

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {};

  ngOnInit() {
    if (!this.link) {
      this.link = this.router.url;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.deleteEvent.emit('delete');
    this.onCancel();
  }
}
