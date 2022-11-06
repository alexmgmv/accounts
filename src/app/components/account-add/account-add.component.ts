import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { DataService } from 'src/app/data/data.service';
import { CreateAccountDto } from 'src/app/models/account.interface';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.scss']
})
export class AccountAddComponent {

  accountForm = new FormGroup({
    accountNo: new FormControl<string>('', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{25}$')]),
    createdAt: new FormControl<string>(''),
    amount: new FormControl<string>('', [Validators.required, Validators.pattern('[0-9]{1,}')]),
    userId: new FormControl<number>(0),
    user: new FormControl<string>('', Validators.required)
  });

  accountNumberControl = this.accountForm.get('accountNo') as FormControl;
  amountControl = this.accountForm.get('amount') as FormControl;
  userControl = this.accountForm.get('user') as FormControl;

  constructor(private dataService: DataService, private router: Router, private infoService: MatSnackBar) { }

  getErrorMessage(control: string) {
    switch (control) {
      case 'account':
        if (this.accountNumberControl.hasError('required')) {
          return 'Required field';
        }
        if (this.accountNumberControl.hasError('pattern')) {
          return 'Must begin with GR and then 25 digits';
        }
        break;
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

  onCreate() {
    const body: CreateAccountDto = {
      userId: 0,
      createdAt: new Date().toJSON(),
      accountNo: this.accountNumberControl.value,
      amount: this.amountControl.value,
      user: this.userControl.value
    };
    this.dataService.createAccount(body).pipe(
      tap(() => {
        this.infoService.open('Account Created', 'OK', { duration: 3000 });
        this.router.navigate(['/', 'account', 'list']);
      }),
      catchError(error => {
        this.infoService.open(JSON.stringify(error), 'OK');
        return EMPTY;
      })
    ).subscribe();
  }

}