import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
export class UsersListComponent implements OnInit {
  users: UsersResponse[] = [];
  currentUser: User | null = null;
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users: UsersResponse[]) => {
        // Filtrar o usuário atual da lista
        this.users = users.filter(user => user.id !== this.currentUser?.id);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
        alert('Erro ao carregar usuários');
      }
    });
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
}
