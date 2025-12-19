import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';

export enum BetStatus {
  PENDING = 0,
  CHANGE_AVALIADOR = 1,
  ACCEPTED = 2,
  REJECTED = 3,
  COMPLETED = 4,
  REJECTED_BY_AVALIADOR = 5,
}

@Table({
  tableName: 'bets',
  timestamps: true,
})
export class Bet extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: BetStatus.PENDING,
  })
  status: BetStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  creatorId: number;

  @BelongsTo(() => User, 'creatorId')
  creator: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  opponentId: number;

  @BelongsTo(() => User, 'opponentId')
  opponent: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  winnerId: number;

  @BelongsTo(() => User, 'winnerId')
  winner: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 1,
  })
  avaliadorId: number;

  @BelongsTo(() => User, 'avaliadorId')
  avaliador: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
