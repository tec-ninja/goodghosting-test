import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GameService } from './game.service';
import { NULL_ADDRESS } from '../constants';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      }],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('get player succeeds with valid address', async () => {
    expect(await service.getPlayer('0x826a471055333505e596f424348983af0aa8411b'))
      .toStrictEqual({
        addr: '0x826a471055333505E596F424348983aF0Aa8411B',
        withdrawn: true,
        canRejoin: true,
        mostRecentSegmentPaid: 0,
        amountPaid: 1000000000000000000
      })
  })

  test('get player fails with non-existent player address', async () => {
    expect(await service.getPlayer('0x826a471055333505e596f424348983af0aa84136'))
      .toStrictEqual({
        addr: NULL_ADDRESS,
        withdrawn: false,
        canRejoin: false,
        mostRecentSegmentPaid: 0,
        amountPaid: 0
      })
  })

  test('Current block timestamp should be greater than zero',async () => {
    expect(await service.getCurrentBlockTime())
    .toBeGreaterThan(0)
  })

  test('First segment start time should be greater than zero',async () => {
    expect(await service.getFirstSegmentStart())
    .toBeGreaterThan(0)
  })

  test('First segment start time should be greater than zero',async () => {
    expect(await service.getSegmentLength())
      .toBeGreaterThan(0)
  })
});
