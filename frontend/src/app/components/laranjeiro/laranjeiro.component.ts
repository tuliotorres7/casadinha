import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
export class LaranjeiroComponent implements OnInit {
  bets: BetWithUsers[] = [];
  currentUser: User | null = null;
  loading: boolean = true;

  constructor(
    private betsService: BetsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBetsAsAvaliador();
  }

  loadBetsAsAvaliador(): void {
    this.betsService.getBetsAsAvaliador().subscribe({
      next: (bets: any) => {
        // Filtrar apostas pendentes que precisam de julgamento
        this.bets = bets.filter((bet: BetWithUsers) => 
          bet.status === 'pending' && !bet.winnerId
        );
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar apostas:', error);
        this.loading = false;
        alert('Erro ao carregar apostas para julgar');
      }
    });
  }

  declareWinner(betId: number, winnerId: number): void {
    if (!confirm('Tem certeza que deseja declarar este vencedor?')) {
      return;
    }

    this.betsService.declareWinner(betId, winnerId).subscribe({
      next: () => {
        alert('Vencedor declarado com sucesso! 🍊');
        this.loadBetsAsAvaliador();
      },
      error: (error: any) => {
        console.error('Erro ao declarar vencedor:', error);
        alert('Erro ao declarar vencedor: ' + (error.error?.message || 'Tente novamente'));
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
