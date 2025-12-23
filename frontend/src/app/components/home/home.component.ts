import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  user: User | null = null;
  showProfileMenu: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sub = this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu(): void {
    this.showProfileMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  createBet(): void {
    this.closeProfileMenu();
    this.router.navigate(['/create-bet']);
  }

  viewUsers(): void {
    this.closeProfileMenu();
    this.router.navigate(['/users']);
  }

  viewMyBets(): void {
    this.closeProfileMenu();
    this.router.navigate(['/my-bets']);
  }

  goToLaranjeiro(): void {
    this.closeProfileMenu();
    this.router.navigate(['/laranjeiro']);
  }

  viewRanking(): void {
    this.router.navigate(['/ranking']);
  }

  viewPublicBets(): void {
    this.router.navigate(['/public-bets']);
  }

  closeProfileMenuOnAction(): void {
    this.closeProfileMenu();
  }

  goHome(): void {
    this.showProfileMenu = false;
    // Já estamos na home, apenas fecha o menu
  }
}
