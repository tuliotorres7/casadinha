import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';

interface UsersResponse {
  id: number;
  email: string;
  name: string;
  picture: string;
  coins: number;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: UsersResponse[] = [];
  currentUser: User | null = null;
  loading: boolean = true;
  showProfileMenu: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUsers(): void {
    const sub = this.authService.getAllUsers().subscribe({
      next: (users: UsersResponse[]) => {
        // Filtrar o usuário atual da lista
        this.users = users.filter(user => user.id !== this.currentUser?.id);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
        // Não mostra alert ao navegar para outra página
      }
    });
    this.subscriptions.push(sub);
  }

  createBetWithUser(user: UsersResponse): void {
    // Navega para a página de criar aposta com o email pré-preenchido
    this.router.navigate(['/create-bet'], { 
      queryParams: { friendEmail: user.email } 
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
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
