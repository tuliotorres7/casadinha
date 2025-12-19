import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BetsService } from '../../services/bets.service';
import { AuthService, User } from '../../services/auth.service';

interface BetWithUsers {
  id: number;
  description: string;
  amount: number;
  status: number;
  createdAt: Date;
  creator: User;
  opponent: User;
  avaliador: User;
  proposedAvaliador?: User;
  winner?: User;
  creatorId: number;
  opponentId: number;
  avaliadorId: number;
  proposedAvaliadorId?: number;
  winnerId?: number;
}

@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.css']
})
export class MyBetsComponent implements OnInit {
  bets: BetWithUsers[] = [];
  filteredBets: BetWithUsers[] = [];
  currentUser: User | null = null;
  loading: boolean = true;
  showProfileMenu: boolean = false;
  activeFilter: number | string | null = null;
  showAvaliadorModal: boolean = false;
  selectedBetForChange: BetWithUsers | null = null;
  availableUsers: User[] = [];

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
        this.filteredBets = bets;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar apostas:', error);
        this.loading = false;
        alert('Erro ao carregar apostas');
      }
    });
  }

  filterByStatus(status: number | null): void {
    this.activeFilter = status;
    if (status === null) {
      this.filteredBets = this.bets;
    } else {
      this.filteredBets = this.bets.filter(bet => bet.status === status);
    }
  }

  filterByWon(): void {
    this.activeFilter = 'won';
    this.filteredBets = this.bets.filter(bet => 
      bet.status === 4 && bet.winnerId === this.currentUser?.id
    );
  }

  filterByLost(): void {
    this.activeFilter = 'lost';
    this.filteredBets = this.bets.filter(bet => 
      bet.status === 4 && bet.winnerId !== this.currentUser?.id && bet.winnerId !== null
    );
  }

  getWonBetsCount(): number {
    return this.bets.filter(bet => 
      bet.status === 4 && bet.winnerId === this.currentUser?.id
    ).length;
  }

  getLostBetsCount(): number {
    return this.bets.filter(bet => 
      bet.status === 4 && bet.winnerId !== this.currentUser?.id && bet.winnerId !== null
    ).length;
  }

  isCreator(bet: BetWithUsers): boolean {
    return bet.creatorId === this.currentUser?.id;
  }

  getOpponentName(bet: BetWithUsers): string {
    return this.isCreator(bet) ? bet.opponent.name : bet.creator.name;
  }

  getStatusLabel(status: number | string): string {
    const labels: any = {
      0: 'Pendente',
      1: 'Mudar Laranja',
      2: 'Aceita',
      3: 'Rejeitada',
      4: 'Finalizada',
      5: 'Rejeitada pelo Laranja',
      'pending': 'Pendente',
      'accepted': 'Aceita',
      'rejected': 'Rejeitada',
      'completed': 'Finalizada'
    };
    return labels[status] || status;
  }

  getStatusClass(status: number | string): string {
    const statusMap: any = {
      0: 'pending',
      1: 'change-avaliador',
      2: 'accepted',
      3: 'rejected',
      4: 'completed',
      5: 'rejected'
    };
    const statusName = typeof status === 'number' ? statusMap[status] : status;
    return `status-${statusName}`;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  createNewBet(): void {
    this.router.navigate(['/create-bet']);
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

  isWinner(bet: BetWithUsers): boolean {
    debugger
    return bet.winnerId === this.currentUser?.id;
  }

  getWinnerName(bet: BetWithUsers): string {
    if (!bet.winner) return 'Não definido';
    return bet.winner.name;
  }

  acceptBet(betId: number): void {
    if (confirm('Tem certeza que deseja aceitar esta aposta?')) {
      this.betsService.acceptBet(betId).subscribe({
        next: () => {
          alert('Aposta aceita com sucesso!');
          this.loadBets();
        },
        error: (error: any) => {
          console.error('Erro ao aceitar aposta:', error);
          alert(error.error?.message || 'Erro ao aceitar aposta');
        }
      });
    }
  }

  rejectBet(betId: number): void {
    if (confirm('Tem certeza que deseja recusar esta aposta?')) {
      this.betsService.rejectBet(betId).subscribe({
        next: () => {
          alert('Aposta recusada. As moedas foram devolvidas ao criador.');
          this.loadBets();
        },
        error: (error: any) => {
          console.error('Erro ao recusar aposta:', error);
          alert(error.error?.message || 'Erro ao recusar aposta');
        }
      });
    }
  }

  goToUsers(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/users']);
  }

  openChangeAvaliadorModal(bet: BetWithUsers): void {
    this.selectedBetForChange = bet;
    this.showAvaliadorModal = true;
    this.loadAvailableUsers(bet);
  }

  closeAvaliadorModal(): void {
    this.showAvaliadorModal = false;
    this.selectedBetForChange = null;
    this.availableUsers = [];
  }

  loadAvailableUsers(bet: BetWithUsers): void {
    this.authService.getAllUsers().subscribe({
      next: (users: User[]) => {
        // Filtrar para não incluir os apostadores
        this.availableUsers = users.filter(
          user => user.id !== bet.creatorId && user.id !== bet.opponentId
        );
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários:', error);
        alert('Erro ao carregar usuários disponíveis');
      }
    });
  }

  changeAvaliador(newAvaliadorId: number): void {
    if (!this.selectedBetForChange) return;

    this.betsService.changeAvaliador(this.selectedBetForChange.id, newAvaliadorId).subscribe({
      next: () => {
        alert('Solicitação de mudança de avaliador enviada! Aguardando aprovação do criador da aposta.');
        this.closeAvaliadorModal();
        this.loadBets();
      },
      error: (error: any) => {
        console.error('Erro ao solicitar mudança de avaliador:', error);
        alert(error.error?.message || 'Erro ao solicitar mudança de avaliador');
      }
    });
  }

  approveAvaliadorChange(betId: number): void {
    if (confirm('Deseja aprovar a mudança de avaliador?')) {
      this.betsService.approveAvaliadorChange(betId).subscribe({
        next: () => {
          alert('Mudança de avaliador aprovada com sucesso!');
          this.loadBets();
        },
        error: (error: any) => {
          console.error('Erro ao aprovar mudança:', error);
          alert(error.error?.message || 'Erro ao aprovar mudança de avaliador');
        }
      });
    }
  }

  rejectAvaliadorChange(betId: number): void {
    if (confirm('Deseja rejeitar a mudança de avaliador?')) {
      this.betsService.rejectAvaliadorChange(betId).subscribe({
        next: () => {
          alert('Mudança de avaliador rejeitada.');
          this.loadBets();
        },
        error: (error: any) => {
          console.error('Erro ao rejeitar mudança:', error);
          alert(error.error?.message || 'Erro ao rejeitar mudança de avaliador');
        }
      });
    }
  }

  canChangeAvaliador(bet: BetWithUsers): boolean {
    // Pode mudar o avaliador se a aposta está pendente e o usuário é apostador
    return bet.status === 0 && (bet.creatorId === this.currentUser?.id || bet.opponentId === this.currentUser?.id);
  }

  canApproveAvaliadorChange(bet: BetWithUsers): boolean {
    // Apenas o criador pode aprovar/rejeitar se o status for CHANGE_AVALIADOR
    return bet.status === 1 && bet.creatorId === this.currentUser?.id;
  }
}
