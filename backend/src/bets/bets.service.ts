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
  ) {}

  async createBet(creatorId: number, createBetDto: CreateBetDto): Promise<Bet> {
    const { description, friendEmail, amount } = createBetDto;

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

    // Criar a aposta
    const bet = await this.betModel.create({
      description,
      amount,
      creatorId,
      opponentId: opponent.id,
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
      ],
    });

    if (!bet) {
      throw new NotFoundException('Aposta não encontrada');
    }

    return bet;
  }
}
