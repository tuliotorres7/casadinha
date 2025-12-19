import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BetsService } from '../../services/bets.service';
import { AuthService, User } from '../../services/auth.service';

interface UserStats {
  user: User;
  wins: number;
  losses: number;
  totalBets: number;
  winRate: number;
  coinsWon: number;
  coinsLost: number;
  balance: number;
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  winners: UserStats[] = [];
  losers: UserStats[] = [];
  loading: boolean = true;

  constructor(
    private betsService: BetsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRanking();
  }

  loadRanking(): void {
    this.betsService.getRanking().subscribe({
      next: (data: any) => {
        this.winners = data.winners || [];
        this.losers = data.losers || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar ranking:', error);
        this.loading = false;
        alert('Erro ao carregar ranking');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
