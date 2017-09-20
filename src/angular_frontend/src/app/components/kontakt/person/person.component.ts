import { Component, OnInit, Input } from '@angular/core';
import { IUser } from 'app/model';

@Component({
  selector: 'fg-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  @Input() user: IUser;
  @Input() isEven: boolean;

  constructor() { }

  ngOnInit() {
  }
}
