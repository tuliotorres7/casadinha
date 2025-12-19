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

  @Get('ranking')
  async getRanking() {
    return this.betsService.getRanking();
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

  @Patch(':id/accept')
  async acceptBet(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.betsService.acceptBet(+id, userId);
  }

  @Patch(':id/reject')
  async rejectBet(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.betsService.rejectBet(+id, userId);
  }

  @Patch(':id/reject-avaliador')
  async rejectAsAvaliador(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.betsService.rejectAsAvaliador(+id, userId);
  }

  @Patch(':id/change-avaliador')
  async changeAvaliador(
    @Param('id') id: string, 
    @Body('newAvaliadorId') newAvaliadorId: number,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.betsService.changeAvaliador(+id, userId, newAvaliadorId);
  }

  @Patch(':id/approve-avaliador-change')
  async approveAvaliadorChange(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.betsService.approveAvaliadorChange(+id, userId);
  }

  @Patch(':id/reject-avaliador-change')
  async rejectAvaliadorChange(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.betsService.rejectAvaliadorChange(+id, userId);
  }
}
