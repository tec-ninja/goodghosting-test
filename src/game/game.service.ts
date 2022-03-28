import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract'
import GameAbi from './abi/goodghosting';

interface Player {
  addr: string,
  withdrawn: boolean,
  canRejoin: boolean,
  mostRecentSegmentPaid: string,
  amountPaid: string
}

@Injectable()
export class GameService {

  private web3: any;
  private contract: Contract;
  constructor(private configService: ConfigService) {
    this.web3 = new Web3(this.configService.get('INFURA_URL'));
    this.contract = new this.web3.eth.Contract(GameAbi as AbiItem[], this.configService.get('CONTRACT_ADDRESS'));
  }

  async getPlayer(address: string): Promise<any> {
    let player: Player = await this.contract.methods.players(address).call();
    const { 
      addr, 
      withdrawn, 
      canRejoin, 
      mostRecentSegmentPaid, 
      amountPaid 
    } = player;
    return { 
      addr, 
      withdrawn, 
      canRejoin, 
      mostRecentSegmentPaid: parseInt(mostRecentSegmentPaid), 
      amountPaid: parseInt(amountPaid) 
    };
  }

  async getCurrentBlockTime(): Promise<number> {
    let timestamp: number = +(await this.web3.eth.getBlock(await this.web3.eth.getBlockNumber())).timestamp;
    return timestamp;
  }

  async getFirstSegmentStart(): Promise<number> {
    let start: number = +(await this.contract.methods.firstSegmentStart().call());
    return start;
  }

  async getSegmentLength(): Promise<number> {
    let segLength = +(await this.contract.methods.segmentLength().call());
    return segLength;
  }
}
