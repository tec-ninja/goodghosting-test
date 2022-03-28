import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GameController } from './game.controller';
import { GameService } from './game.service';

jest.setTimeout(10000);

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService, {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'INFURA_URL')
                return 'https://kovan.infura.io/v3/0e91e829e35f4fb0b0f93974280f88c6';
              else if (key === 'CONTRACT_ADDRESS')
                return '0xc69a569405EAE312Ca13C2eD85a256FbE4992A35';
            })
          }
        }
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('get segment succeeds', async () => {
    expect(await controller.getSegment()).toStrictEqual({success: true, data: expect.any(Number)})
  })

  test('get segment fails with error from smart contract call', async () => {
    try{
      await controller.getSegment();
    } catch (e) {
      expect(e).toStrictEqual({
        success: false,
        message: e.toString()
      })
    }
  })

  test('get player succeeds with valid address', async () => {
    expect(await controller.getPlayer('0x826a471055333505e596f424348983af0aa8411b'))
      .toStrictEqual({
        success: true,
        data: {
          addr:'0x826a471055333505E596F424348983aF0Aa8411B',
          withdrawn: true,
          canRejoin: true,
          mostRecentSegmentPaid: 0,
          amountPaid: 1000000000000000000
        }
      })
  })

  test('get player fails with non-existent player address', async () => {
    expect(await controller.getPlayer('0x826a471055333505e596f424348983af0aa84136'))
      .toStrictEqual({
        success: false,
        message: 'Non-existent Player!'
      })
  })

  test('get player fails with error from invalid address or smart contract function call', async () => {
    expect(await controller.getPlayer('0x826a471055333505e596af0aa84136'))
      .toStrictEqual({
        success: false,
        message: expect.any(String)
      })
  })
});
