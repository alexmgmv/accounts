import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, of, switchMap, tap } from 'rxjs';
import { DataService } from 'src/app/data/data.service';
import { EditAccountDto } from 'src/app/models/account.interface';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent {

  dateDB = '';

  accountForm = new FormGroup({
    id: new FormControl<number>(0),
    accountNo: new FormControl<string>('', Validators.required),
    createdAt: new FormControl<string>(''),
    amount: new FormControl<string>('', [Validators.required, Validators.pattern('[0-9]{1,}')]),
    userId: new FormControl<number>(0),
    user: new FormControl<string>('', Validators.required)
  });

  amountControl = this.accountForm.get('amount') as FormControl;
  userControl = this.accountForm.get('user') as FormControl;
  dateControl = this.accountForm.get('createdAt') as FormControl;
  accountNumberControl = this.accountForm.get('accountNo') as FormControl;

  account$ = of(this.route.snapshot.paramMap.get('id')).pipe(
    switchMap(id => this.dataService.getAccountById(Number(id))),
    tap(account => {
      this.accountForm.patchValue(account);
      this.dateDB = account.createdAt;
      const dateTemplate = `${account.createdAt.substring(0, 10)}, ${account.createdAt.substring(11, 16)}`;
      this.dateControl.setValue(dateTemplate);
    })
  );

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private infoService: MatSnackBar,
    private location: Location
  ) {
    this.accountForm.disable();
    this.amountControl.enable();
    this.userControl.enable();
  }

  getErrorMessage(control: string) {
    switch (control) {
      case 'amount':
        if (this.amountControl.hasError('required')) {
          return 'Required field';
        }
        if (this.amountControl.hasError('pattern')) {
          return 'Numbers only, no decimal point';
        }
        break;
      case 'user':
        if (this.userControl.hasError('required')) {
          return 'Required field';
        }
        break;
      default:
        return '';
    }
    return '';
  }

  onEdit() {
    const body: EditAccountDto = {
      accountNo: this.accountNumberControl.value,
      amount: this.amountControl.value,
      createdAt: this.dateDB,
      user: this.userControl.value,
      userId: 0
    };
    const id = this.accountForm.get('id')?.value;

    this.dataService.editAccount(Number(id), body).pipe(
      tap(() => {
        this.infoService.open('Account Edited', 'OK', { duration: 3000 });
        this.router.navigate(['/', 'account', 'list']);
      }),
      catchError(error => {
        this.infoService.open(JSON.stringify(error), 'OK');
        return EMPTY;
      })
    ).subscribe();
  }

  onReturn() {
    this.location.back();
  }

}