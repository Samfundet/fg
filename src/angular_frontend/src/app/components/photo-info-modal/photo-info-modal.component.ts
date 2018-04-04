import { Component, OnInit, Input, Inject } from '@angular/core';
import { IPhoto } from 'app/model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



@Component({
  selector: 'fg-photo-info-modal',
  templateUrl: './photo-info-modal.component.html',
  styleUrls: ['./photo-info-modal.component.scss']
})
export class PhotoInfoModalComponent implements OnInit {
@Input() photoDescription: string ;
 showDescription: boolean;  // knapp for å vise description trykket?
 constructor ()  { }

  ngOnInit() {
    console.log(this.photoDescription);
    this.showDescription = false;

  }
  openDescription(): void {
    // TODO
    });
