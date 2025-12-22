import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BetsService } from '../../services/bets.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-create-bet',
  templateUrl: './create-bet.component.html',
  styleUrls: ['./create-bet.component.css']
})
export class CreateBetComponent implements OnInit, OnDestroy {
  betDescription: string = '';
  friendEmail: string = '';
  betAmount: number = 0;
  loading: boolean = false;
  currentUser: User | null = null;
  showProfileMenu: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private betsService: BetsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // Pré-preencher email se vier da página de usuários
    const sub = this.route.queryParams.subscribe(params => {
      if (params['friendEmail']) {
        this.friendEmail = params['friendEmail'];
      }
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

    const sub = this.betsService.createBet(betData).subscribe({
      next: (response: any) => {
        console.log('Aposta criada:', response);
        alert('Aposta criada com sucesso!');
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Erro ao criar aposta:', error);
        this.loading = false;
        
        // Não mostra alert ao navegar para outra página
        if (error.error?.message && error.status !== 0) {
          alert(`Erro: ${error.error.message}`);
        }
      }
    });
    this.subscriptions.push(sub);
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
