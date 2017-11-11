import { Component, OnInit, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { SnackbarService } from 'app/services/snackbar.service';
import { Snack } from 'app/model';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/delay';

@Component({
    selector: 'fg-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
    animations: [
        trigger('slideInOut',
        [
            state('*',
                style({
                    height: '*',
                    opacity: 1
                })),
            state('void',
                style({
                    height: '0',
                    opacity: 0
                })),
            transition('* => void', animate('200ms ease-out')),
            transition('void => *', animate('400ms cubic-bezier(.44,1.25,.66,1.02)'))
        ])
    ]
})
export class SnackbarComponent implements OnInit {
    snack: Snack;
    constructor(public snackBarService: SnackbarService) {}

    ngOnInit() {
        this.snackBarService.getSnackbar().subscribe((snack: Snack) => {
            this.snack = snack;

            if (snack) {
                Observable.range(0, 1).delay(snack.duration).subscribe(() => {
                    this.snackBarService.next(null);
                });
            }
        });
    }
}
