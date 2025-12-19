import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  showProfileMenu: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
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

  closeProfileMenuOnAction(): void {
    this.closeProfileMenu();
  }
}
