import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BetsService } from '../../services/bets.service';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private betsService: BetsService
  ) {}

  ngOnInit(): void {
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
      amount: this.betAmount
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
}
