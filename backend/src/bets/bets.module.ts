import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BetsController } from './bets.controller';
import { BetsService } from './bets.service';
import { Bet } from './bet.model';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Bet, User])],
  controllers: [BetsController],
  providers: [BetsService],
  exports: [BetsService],
})
export class BetsModule {}
