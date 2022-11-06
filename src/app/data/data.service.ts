import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Account, CreateAccountDto, EditAccountDto } from '../models/account.interface';

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(private http: HttpClient) { }

  getAllAccounts() {
    return this.http.get<Account[]>(environment.apiUrl);
  }

  getAccountById(id: number) {
    return this.http.get<Account>(`${environment.apiUrl}/${id}`);
  }

  deleteAccount(id: number) {
    return this.http.delete(`${environment.apiUrl}/${id}`);
  }

  createAccount(body: CreateAccountDto) {
    return this.http.post(environment.apiUrl, body);
  }

  editAccount(id: number, body: EditAccountDto) {
    return this.http.put(`${environment.apiUrl}/${id}`, body);
  }

}