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
            //throw new BadRequestException('Você não pode apostar consigo mesmo');
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
        return this.betModel.findAll({
            where: {
                [Symbol.for('or')]: [{ creatorId: userId }, { opponentId: userId }],
            },
            include: [
                { model: User, as: 'creator' },
                { model: User, as: 'opponent' },
                { model: User, as: 'avaliador' },
            ],
            order: [['createdAt', 'DESC']],
        });
    }
    async findBetById(id: number): Promise<Bet> {
        const bet = await this.betModel.findByPk(id, {
            include: [
                { model: User, as: 'creator' },
                { model: User, as: 'opponent' },
                { model: User, as: 'winner' },
                { model: User, as: 'avaliador' },
            ],
        });

        if (!bet) {
            throw new NotFoundException('Aposta não encontrada');
        }

        return bet;
    }

    async findBetsAsAvaliador(avaliadorId: number): Promise<Bet[]> {
        return this.betModel.findAll({
            where: {
                avaliadorId,
            },
            include: [
                { model: User, as: 'creator' },
                { model: User, as: 'opponent' },
                { model: User, as: 'avaliador' },
                { model: User, as: 'winner' },
            ],
            order: [['createdAt', 'DESC']],
        });
    }

    async declareWinner(betId: number, winnerId: number, avaliadorId: number): Promise<Bet> {
        const bet = await this.findBetById(betId);

        // Verificar se o usuário é o avaliador
        if (bet.avaliadorId !== avaliadorId) {
            throw new BadRequestException('Apenas o avaliador pode declarar o vencedor');
        }

        // Verificar se a aposta está pendente
        if (bet.status !== BetStatus.PENDING) {
            throw new BadRequestException('Apenas apostas pendentes podem ter um vencedor declarado');
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
}
