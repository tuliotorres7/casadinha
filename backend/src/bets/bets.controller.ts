import { Controller, Post, Get, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bets')
@UseGuards(JwtAuthGuard)
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  async createBet(@Request() req, @Body() createBetDto: CreateBetDto) {
    const userId = req.user.id;
    return this.betsService.createBet(userId, createBetDto);
  }

  @Get()
  async getUserBets(@Request() req) {
    const userId = req.user.id;
    return this.betsService.findUserBets(userId);
  }

  @Get('avaliador')
  async getBetsAsAvaliador(@Request() req) {
    const userId = req.user.id;
    return this.betsService.findBetsAsAvaliador(userId);
  }

  @Get(':id')
  async getBetById(@Param('id') id: string) {
    return this.betsService.findBetById(+id);
  }

  @Patch(':id/winner')
  async declareWinner(
    @Param('id') id: string,
    @Body('winnerId') winnerId: number,
    @Request() req
  ) {
    const avaliadorId = req.user.id;
    return this.betsService.declareWinner(+id, winnerId, avaliadorId);
  }
}
