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
}

@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.css']
})
export class MyBetsComponent implements OnInit {
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
    this.loadBets();
  }

  loadBets(): void {
    this.betsService.getUserBets().subscribe({
      next: (bets: any) => {
        this.bets = bets;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar apostas:', error);
        this.loading = false;
        alert('Erro ao carregar apostas');
      }
    });
  }

  isCreator(bet: BetWithUsers): boolean {
    return bet.creatorId === this.currentUser?.id;
  }

  getOpponentName(bet: BetWithUsers): string {
    return this.isCreator(bet) ? bet.opponent.name : bet.creator.name;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'pending': 'Pendente',
      'accepted': 'Aceita',
      'rejected': 'Rejeitada',
      'completed': 'Finalizada'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  createNewBet(): void {
    this.router.navigate(['/create-bet']);
  }
}
