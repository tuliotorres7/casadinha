import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BetsService } from '../../services/bets.service';
import { AuthService, User } from '../../services/auth.service';

interface BetWithUsers {
  id: number;
  description: string;
  amount: number;
  status: number;
  createdAt: Date;
  creator: User;
  avaliador: User;
  creatorId: number;
  avaliadorId: number;
  opponentId?: number;
  isPublic: boolean;
}

@Component({
  selector: 'app-public-bets',
  templateUrl: './public-bets.component.html',
  styleUrls: ['./public-bets.component.css']
})
export class PublicBetsComponent implements OnInit, OnDestroy {
  publicBets: BetWithUsers[] = [];
  myPublicBets: BetWithUsers[] = [];
  currentUser: User | null = null;
  loading: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(
    private betsService: BetsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPublicBets();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadPublicBets(): void {
    const sub = this.betsService.getPublicBets().subscribe({
      next: (bets: any) => {
        // Separar apostas criadas por mim das apostas de outros usuários
        this.myPublicBets = bets.filter((bet: BetWithUsers) => 
          bet.creatorId === this.currentUser?.id
        );
        this.publicBets = bets.filter((bet: BetWithUsers) => 
          bet.creatorId !== this.currentUser?.id
        );
        console.log('Apostas públicas carregadas:', {
          total: bets.length,
          minhas: this.myPublicBets.length,
          disponiveis: this.publicBets.length,
          minhasApostas: this.myPublicBets,
          apostasDisponiveis: this.publicBets
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar apostas públicas:', error);
        this.loading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  acceptPublicBet(betId: number): void {
    if (confirm('Deseja aceitar esta aposta pública?')) {
      const sub = this.betsService.acceptPublicBet(betId).subscribe({
        next: () => {
          alert('Aposta aceita com sucesso! Boa sorte! 🎯');
          this.loadPublicBets();
        },
        error: (error: any) => {
          console.error('Erro ao aceitar aposta:', error);
          if (error.error?.message && error.status !== 0) {
            alert(error.error.message);
          }
        }
      });
      this.subscriptions.push(sub);
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  createPublicBet(): void {
    this.router.navigate(['/create-bet'], { 
      queryParams: { isPublic: true } 
    });
  }
}
