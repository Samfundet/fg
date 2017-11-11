import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ISnack, Snack } from 'app/model';

@Injectable()
export class SnackbarService {
    private snackbarSubject = new Subject<Snack>();

    next(snackbar: ISnack) {
        this.snackbarSubject.next(new Snack(snackbar));
    }

    getSnackbar() {
        return this.snackbarSubject.asObservable();
    }
}
