import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { CreateBetComponent } from './components/create-bet/create-bet.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { MyBetsComponent } from './components/my-bets/my-bets.component';
import { LaranjeiroComponent } from './components/laranjeiro/laranjeiro.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { AuthGuard } from './guards/auth.guard';
import { FilterPipe } from './pipes/filter.pipe';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'create-bet', component: CreateBetComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'my-bets', component: MyBetsComponent, canActivate: [AuthGuard] },
  { path: 'laranjeiro', component: LaranjeiroComponent, canActivate: [AuthGuard] },
  { path: 'ranking', component: RankingComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AuthCallbackComponent,
    CreateBetComponent,
    UsersListComponent,
    MyBetsComponent,
    LaranjeiroComponent,
    RankingComponent,
    HeaderComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
