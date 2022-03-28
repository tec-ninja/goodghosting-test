import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { NULL_ADDRESS } from '../constants';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('player/:address')
  async getPlayer(@Param('address') address: string) {
    try {
      let player = await this.gameService.getPlayer(address);
      if (player.addr !== NULL_ADDRESS)
        return {
          success: true,
          data: player
        };
      else
        return {
          success: false,
          message: 'Non-existent Player!'
        };
    } catch(e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }

  @Get('segment')
  async getSegment() {
    try {
      let blockTime = await this.gameService.getCurrentBlockTime();
      let firstSegStart = await this.gameService.getFirstSegmentStart();
      let segLength = await this.gameService.getSegmentLength();
      return {
        success: true,
        data: Math.floor((blockTime - firstSegStart) / segLength)
      };
    } catch(e) {
      return {
        success: false,
        message: e.toString()
      };
    }
  }
}
