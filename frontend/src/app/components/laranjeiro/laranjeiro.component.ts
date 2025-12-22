import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BetsService } from '../../services/bets.service';
import { AuthService, User } from '../../services/auth.service';

interface BetWithUsers {
  id: number;
  description: string;
  amount: number;
  status: string;
  createdAt: Date;
  creator: User;
  opponent: User;
  avaliador: User;
  creatorId: number;
  opponentId: number;
  avaliadorId: number;
  winnerId?: number;
}

@Component({
  selector: 'app-laranjeiro',
  templateUrl: './laranjeiro.component.html',
  styleUrls: ['./laranjeiro.component.css']
})
export class LaranjeiroComponent implements OnInit, OnDestroy {
  bets: BetWithUsers[] = [];
  currentUser: User | null = null;
  loading: boolean = true;
  showProfileMenu: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private betsService: BetsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBetsAsAvaliador();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBetsAsAvaliador(): void {
    const sub = this.betsService.getBetsAsAvaliador().subscribe({
      next: (bets: any) => {
        // Backend já retorna apenas apostas aceitas aguardando julgamento
        this.bets = bets;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar apostas:', error);
        this.loading = false;
        // Não mostra alert ao navegar para outra página
      }
    });
    this.subscriptions.push(sub);
  }

  declareWinner(betId: number, winnerId: number): void {
    if (!confirm('Tem certeza que deseja declarar este vencedor?')) {
      return;
    }

    const sub = this.betsService.declareWinner(betId, winnerId).subscribe({
      next: () => {
        alert('Vencedor declarado com sucesso! 🍊');
        this.loadBetsAsAvaliador();
      },
      error: (error: any) => {
        console.error('Erro ao declarar vencedor:', error);
        // Não mostra alert ao navegar para outra página
      }
    });
    this.subscriptions.push(sub);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goToLaranjeiro(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/laranjeiro']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToMyBets(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/my-bets']);
  }

  goToCreateBet(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/create-bet']);
  }

  goToUsers(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/users']);
  }

  rejectAsAvaliador(betId: number): void {
    if (confirm('Tem certeza que não quer ser o avaliador desta aposta? As moedas serão devolvidas aos participantes.')) {
      const sub = this.betsService.rejectAsAvaliador(betId).subscribe({
        next: () => {
          alert('Você recusou avaliar esta aposta. As moedas foram devolvidas. 🍊');
          this.loadBetsAsAvaliador();
        },
        error: (error: any) => {
          console.error('Erro ao recusar avaliação:', error);
          // Não mostra alert ao navegar para outra página
        }
      });
      this.subscriptions.push(sub);
    }
  }
}
