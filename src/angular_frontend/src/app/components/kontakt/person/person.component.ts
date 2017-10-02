import { Component, OnInit, Input } from '@angular/core';
import { IUser } from 'app/model';

@Component({
  selector: 'fg-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  @Input() user: IUser | null; // Stupid workaround that fixes the damn warnings, should be fixed in Angular 5
  @Input() isEven: boolean;

  constructor() { }

  ngOnInit() {
  }
}
