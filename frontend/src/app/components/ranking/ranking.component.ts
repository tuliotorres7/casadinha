import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class RankingComponent implements OnInit, OnDestroy {
    winners: UserStats[] = [];
    losers: UserStats[] = [];
    loading: boolean = true;
    showProfileMenu: boolean = false;
    currentUser: User | null = null;
    private subscriptions: Subscription[] = [];

    constructor(
        private betsService: BetsService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        this.loadRanking();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    loadRanking(): void {
        const sub = this.betsService.getRanking().subscribe({
            next: (data: any) => {
                this.winners = data.winners || [];
                this.losers = data.losers || [];
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Erro ao carregar ranking:', error);
                this.loading = false;
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
} 
