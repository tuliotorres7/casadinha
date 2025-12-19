import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BetsService } from '../../services/bets.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-create-bet',
  templateUrl: './create-bet.component.html',
  styleUrls: ['./create-bet.component.css']
})
export class CreateBetComponent implements OnInit {
  betDescription: string = '';
  friendEmail: string = '';
  betAmount: number = 0;
  loading: boolean = false;
  currentUser: User | null = null;
  showProfileMenu: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private betsService: BetsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // Pré-preencher email se vier da página de usuários
    this.route.queryParams.subscribe(params => {
      if (params['friendEmail']) {
        this.friendEmail = params['friendEmail'];
      }
    });
  }

  createBet() {
    if (!this.betDescription || !this.friendEmail || !this.betAmount) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    this.loading = true;

    const betData = {
      description: this.betDescription,
      friendEmail: this.friendEmail,
      amount: this.betAmount,
      avaliadorId: 1 // ID do avaliador padrão
    };

    this.betsService.createBet(betData).subscribe({
      next: (response: any) => {
        console.log('Aposta criada:', response);
        alert('Aposta criada com sucesso!');
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Erro ao criar aposta:', error);
        this.loading = false;
        
        if (error.error?.message) {
          alert(`Erro: ${error.error.message}`);
        } else {
          alert('Erro ao criar aposta. Tente novamente.');
        }
      }
    });
  }

  cancel() {
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
