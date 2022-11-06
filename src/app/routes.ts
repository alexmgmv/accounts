import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AccountAddComponent } from './components/account-add/account-add.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: 'account', children: [
            { path: 'list', component: AccountListComponent },
            { path: 'add', component: AccountAddComponent },
            { path: 'details/:id', component: AccountDetailsComponent },
            { path: '**', redirectTo: 'list' }
        ]
    },
    { path: '**', redirectTo: 'home' }
];