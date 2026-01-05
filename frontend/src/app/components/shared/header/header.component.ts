import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showProfileMenu: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goToHome(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/home']);
  }

  goToMyBets(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/my-bets']);
  }

  createBet(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/create-bet']);
  }

  goToPublicBets(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/public-bets']);
  }

  goToUsers(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/users']);
  }

  goToLaranjeiro(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/laranjeiro']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
