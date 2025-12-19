import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bet, BetStatus } from './bet.model';
import { User } from '../users/user.model';
import { CreateBetDto } from './dto/create-bet.dto';

@Injectable()
export class BetsService {
    constructor(
        @InjectModel(Bet)
        private betModel: typeof Bet,
        @InjectModel(User)
        private userModel: typeof User,
    ) { }

    async createBet(creatorId: number, createBetDto: CreateBetDto): Promise<Bet> {
        const { description, friendEmail, amount, avaliadorId } = createBetDto;

        // Buscar o criador da aposta
        const creator = await this.userModel.findByPk(creatorId);
        if (!creator) {
            throw new NotFoundException('Usuário criador não encontrado');
        }

        // Verificar se o criador tem moedas suficientes
        if (creator.coins < amount) {
            throw new BadRequestException('Moedas insuficientes para criar esta aposta');
        }

        // Buscar o oponente pelo email
        const opponent = await this.userModel.findOne({
            where: { email: friendEmail },
        });

        if (!opponent) {
            throw new NotFoundException('Amigo não encontrado com este email');
        }

        if (opponent.id === creatorId) {
            throw new BadRequestException('Você não pode apostar consigo mesmo');
        }

        // Definir o avaliador (padrão é ID 1 - o laranja)
        const finalAvaliadorId = avaliadorId || 1;

        // Criar a aposta
        const bet = await this.betModel.create({
            description,
            amount,
            creatorId,
            opponentId: opponent.id,
            avaliadorId: finalAvaliadorId,
            status: BetStatus.PENDING,
        });

        // Deduzir as moedas do criador
        creator.coins -= amount;
        await creator.save();

        return bet;
    }

    async findUserBets(userId: number): Promise<Bet[]> {
        const bets = await this.betModel.findAll({
            where: {
                [Symbol.for('or')]: [{ creatorId: userId }, { opponentId: userId }],
            },
            include: [
                { model: User, as: 'creator' },
                { model: User, as: 'opponent' },
                { model: User, as: 'avaliador', required: false },
                { model: User, as: 'winner' },
            ],
            order: [['createdAt', 'DESC']],
        });

        // Carregar avaliador padrão (ID 1) para apostas sem avaliador
        const defaultAvaliador = await this.userModel.findByPk(1);
        
        return bets.map(bet => {
            if (!bet.avaliador && defaultAvaliador) {
                bet.avaliador = defaultAvaliador;
            }
            return bet;
        });
    }

    async findBetById(id: number): Promise<Bet> {
        const bet = await this.betModel.findByPk(id, {
            include: [
                { model: User, as: 'creator' },
                { model: User, as: 'opponent' },
                { model: User, as: 'winner' },
                { model: User, as: 'avaliador', required: false },
            ],
        });

        if (!bet) {
            throw new NotFoundException('Aposta não encontrada');
        }

        // Carregar avaliador padrão (ID 1) se não houver avaliador
        if (!bet.avaliador) {
            const defaultAvaliador = await this.userModel.findByPk(1);
            if (defaultAvaliador) {
                bet.avaliador = defaultAvaliador;
            }
        }

        return bet;
    }

    async findBetsAsAvaliador(avaliadorId: number): Promise<Bet[]> {
        const bets = await this.betModel.findAll({
            where: {
                avaliadorId,
                status: BetStatus.ACCEPTED,
            },
            include: [
                { model: User, as: 'creator' },
                { model: User, as: 'opponent' },
                { model: User, as: 'avaliador', required: false },
                { model: User, as: 'winner' },
            ],
            order: [['createdAt', 'DESC']],
        });

        // Carregar avaliador padrão (ID 1) para apostas sem avaliador
        const defaultAvaliador = await this.userModel.findByPk(1);
        
        return bets.map(bet => {
            if (!bet.avaliador && defaultAvaliador) {
                bet.avaliador = defaultAvaliador;
            }
            return bet;
        });
    }

    async declareWinner(betId: number, winnerId: number, avaliadorId: number): Promise<Bet> {
        const bet = await this.findBetById(betId);

        // Verificar se o usuário é o avaliador
        if (bet.avaliadorId !== avaliadorId) {
            throw new BadRequestException('Apenas o avaliador pode declarar o vencedor');
        }

        // Verificar se a aposta está aceita
        if (bet.status !== BetStatus.ACCEPTED) {
            throw new BadRequestException('Apenas apostas aceitas podem ter um vencedor declarado');
        }

        // Verificar se já tem vencedor
        if (bet.winnerId) {
            throw new BadRequestException('Esta aposta já tem um vencedor declarado');
        }

        // Verificar se o vencedor é válido
        if (winnerId !== bet.creatorId && winnerId !== bet.opponentId) {
            throw new BadRequestException('O vencedor deve ser o criador ou oponente da aposta');
        }

        // Buscar o vencedor e o perdedor
        const winner = await this.userModel.findByPk(winnerId);
        const loserId = winnerId === bet.creatorId ? bet.opponentId : bet.creatorId;
        const loser = await this.userModel.findByPk(loserId);

        if (!winner || !loser) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Atualizar a aposta
        bet.winnerId = winnerId;
        bet.status = BetStatus.COMPLETED;
        await bet.save();

        // Transferir moedas: vencedor ganha o dobro do valor apostado
        winner.coins += bet.amount * 2;
        await winner.save();

        return this.findBetById(betId);
    }

    async acceptBet(betId: number, userId: number): Promise<Bet> {
        const bet = await this.findBetById(betId);

        // Verificar se o usuário é o oponente
        if (bet.opponentId !== userId) {
            throw new BadRequestException('Apenas o oponente pode aceitar a aposta');
        }

        // Verificar se a aposta está pendente
        if (bet.status !== BetStatus.PENDING) {
            throw new BadRequestException('Apenas apostas pendentes podem ser aceitas');
        }

        // Buscar o oponente
        const opponent = await this.userModel.findByPk(userId);
        if (!opponent) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Verificar se o oponente tem moedas suficientes
        if (opponent.coins < bet.amount) {
            throw new BadRequestException('Moedas insuficientes para aceitar esta aposta');
        }

        // Deduzir as moedas do oponente
        opponent.coins -= bet.amount;
        await opponent.save();

        // Atualizar status da aposta
        bet.status = BetStatus.ACCEPTED;
        await bet.save();

        return this.findBetById(betId);
    }

    async rejectBet(betId: number, userId: number): Promise<Bet> {
        const bet = await this.findBetById(betId);

        // Verificar se o usuário é o oponente
        if (bet.opponentId !== userId) {
            throw new BadRequestException('Apenas o oponente pode recusar a aposta');
        }

        // Verificar se a aposta está pendente
        if (bet.status !== BetStatus.PENDING) {
            throw new BadRequestException('Apenas apostas pendentes podem ser recusadas');
        }

        // Buscar o criador para devolver as moedas
        const creator = await this.userModel.findByPk(bet.creatorId);
        if (!creator) {
            throw new NotFoundException('Criador não encontrado');
        }

        // Devolver as moedas ao criador
        creator.coins += bet.amount;
        await creator.save();

        // Atualizar status da aposta
        bet.status = BetStatus.REJECTED;
        await bet.save();

        return this.findBetById(betId);
    }

    async rejectAsAvaliador(betId: number, userId: number): Promise<Bet> {
        const bet = await this.findBetById(betId);

        // Verificar se o usuário é o avaliador
        if (bet.avaliadorId !== userId) {
            throw new BadRequestException('Apenas o avaliador pode recusar julgar esta aposta');
        }

        // Verificar se a aposta está aceita (não pode recusar se já tiver vencedor)
        if (bet.status === BetStatus.COMPLETED) {
            throw new BadRequestException('Não é possível recusar apostas já finalizadas');
        }

        if (bet.status === BetStatus.REJECTED || bet.status === BetStatus.REJECTED_BY_AVALIADOR) {
            throw new BadRequestException('Esta aposta já foi rejeitada');
        }

        // Buscar o criador e oponente para devolver as moedas
        const creator = await this.userModel.findByPk(bet.creatorId);
        const opponent = await this.userModel.findByPk(bet.opponentId);

        if (!creator) {
            throw new NotFoundException('Criador não encontrado');
        }

        // Devolver moedas ao criador
        creator.coins += bet.amount;
        await creator.save();

        // Devolver moedas ao oponente se a aposta foi aceita
        if (bet.status === BetStatus.ACCEPTED && opponent) {
            opponent.coins += bet.amount;
            await opponent.save();
        }

        // Rejeitar a aposta pelo avaliador
        bet.status = BetStatus.REJECTED_BY_AVALIADOR;
        await bet.save();

        return this.findBetById(betId);
    }

    async getRanking(): Promise<any> {
        // Buscar todas as apostas completadas
        const completedBets = await this.betModel.findAll({
            where: {
                status: BetStatus.COMPLETED,
            },
            include: [
                { model: User, as: 'creator' },
                { model: User, as: 'opponent' },
                { model: User, as: 'winner' },
            ],
        });

        // Calcular estatísticas por usuário
        const userStatsMap = new Map();

        completedBets.forEach(bet => {
            // Processar criador
            if (!userStatsMap.has(bet.creatorId)) {
                userStatsMap.set(bet.creatorId, {
                    user: bet.creator,
                    wins: 0,
                    losses: 0,
                    totalBets: 0,
                    coinsWon: 0,
                    coinsLost: 0,
                });
            }

            // Processar oponente
            if (!userStatsMap.has(bet.opponentId)) {
                userStatsMap.set(bet.opponentId, {
                    user: bet.opponent,
                    wins: 0,
                    losses: 0,
                    totalBets: 0,
                    coinsWon: 0,
                    coinsLost: 0,
                });
            }

            const creatorStats = userStatsMap.get(bet.creatorId);
            const opponentStats = userStatsMap.get(bet.opponentId);

            creatorStats.totalBets++;
            opponentStats.totalBets++;

            if (bet.winnerId === bet.creatorId) {
                creatorStats.wins++;
                creatorStats.coinsWon += bet.amount * 2;
                opponentStats.losses++;
                opponentStats.coinsLost += bet.amount;
            } else if (bet.winnerId === bet.opponentId) {
                opponentStats.wins++;
                opponentStats.coinsWon += bet.amount * 2;
                creatorStats.losses++;
                creatorStats.coinsLost += bet.amount;
            }
        });

        // Converter para array e calcular taxa de vitória
        const userStats = Array.from(userStatsMap.values()).map(stats => ({
            ...stats,
            winRate: stats.totalBets > 0 ? Math.round((stats.wins / stats.totalBets) * 100) : 0,
            balance: stats.coinsWon - stats.coinsLost,
        }));

        // Ordenar por vitórias (top winners)
        const winners = [...userStats]
            .filter(s => s.wins > 0)
            .sort((a, b) => {
                if (b.wins !== a.wins) return b.wins - a.wins;
                return b.winRate - a.winRate;
            })
            .slice(0, 10);

        // Ordenar por derrotas (top losers)
        const losers = [...userStats]
            .filter(s => s.losses > 0)
            .sort((a, b) => {
                if (b.losses !== a.losses) return b.losses - a.losses;
                return a.winRate - b.winRate;
            })
            .slice(0, 10);

        return {
            winners,
            losers,
        };
    }
}
