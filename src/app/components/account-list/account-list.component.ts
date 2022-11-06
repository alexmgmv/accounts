import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { DataService } from 'src/app/data/data.service';
import { Account } from 'src/app/models/account.interface';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {

  accounts: Account[] = [];
  displayedAccounts: Account[] = [];
  displayedColumns: string[] = ['accountNo', 'amount', 'user', 'createdAt', 'details', 'delete'];
  dataSource!: MatTableDataSource<Account>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataService: DataService, private router: Router, private infoService: MatSnackBar) {
    this.dataService.getAllAccounts().subscribe(data => {
      this.accounts = data;
      this.displayedAccounts = this.accounts.slice(0, 10);
      this.dataSource = new MatTableDataSource<Account>(this.displayedAccounts);
      this.dataSource.paginator = this.paginator;
    });
  }

  onView(id: number) {
    this.router.navigate(['/', 'account', 'details', id]);
  }

  onDelete(id: number) {
    this.dataService.deleteAccount(id).pipe(
      tap(() => {
        setTimeout(this.reloadPage, 1500);
        this.infoService.open('Account Deleted', 'OK', { duration: 3000 });
      }),
      catchError(error => {
        this.infoService.open(JSON.stringify(error), 'OK');
        return EMPTY;
      })
    ).subscribe();
  }

  reloadPage() {
    location.reload();
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = (startIndex + event.pageSize) > event.length ? event.length : (startIndex + event.pageSize);
    this.displayedAccounts = this.accounts.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource<Account>(this.displayedAccounts);
  }

}