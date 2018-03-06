import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'app/services';

@Component({
  selector: 'fg-metadata-modal',
  templateUrl: './metadata-modal.component.html',
  styleUrls: ['./metadata-modal.component.scss']
})
export class MetadataModalComponent implements OnInit {
  @Input() photoID: number;
  // TODO: Everything in this component, backend done but needs to change for better readability
  constructor(private api: ApiService) { }

  ngOnInit() {
  }

}
