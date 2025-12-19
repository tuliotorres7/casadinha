import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Bet {
  id: number;
  description: string;
  amount: number;
  status: string;
  creatorId: number;
  opponentId: number;
  winnerId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBetDto {
  description: string;
  friendEmail: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BetsService {
  private apiUrl = `${environment.apiUrl}/bets`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createBet(betData: CreateBetDto): Observable<Bet> {
    return this.http.post<Bet>(this.apiUrl, betData, { headers: this.getHeaders() });
  }

  getUserBets(): Observable<Bet[]> {
    return this.http.get<Bet[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getBetById(id: number): Observable<Bet> {
    return this.http.get<Bet>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getBetsAsAvaliador(): Observable<Bet[]> {
    return this.http.get<Bet[]>(`${this.apiUrl}/avaliador`, { headers: this.getHeaders() });
  }

  declareWinner(betId: number, winnerId: number): Observable<Bet> {
    return this.http.patch<Bet>(
      `${this.apiUrl}/${betId}/winner`,
      { winnerId },
      { headers: this.getHeaders() }
    );
  }

  getRanking(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ranking`, { headers: this.getHeaders() });
  }

  acceptBet(betId: number): Observable<Bet> {
    return this.http.patch<Bet>(
      `${this.apiUrl}/${betId}/accept`,
      {},
      { headers: this.getHeaders() }
    );
  }

  rejectBet(betId: number): Observable<Bet> {
    return this.http.patch<Bet>(
      `${this.apiUrl}/${betId}/reject`,
      {},
      { headers: this.getHeaders() }
    );
  }

  rejectAsAvaliador(betId: number): Observable<Bet> {
    return this.http.patch<Bet>(
      `${this.apiUrl}/${betId}/reject-avaliador`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
