import { AppDataSource } from '../database';
import { DraftPick } from '../database/models/draft-pick';
import { DraftPickTrade } from '../database/models/draft-pick-trade';
import { Team } from '../database/models/team';
import {
  CreateDraftPickTradeDto,
  DraftPickTradeResponseDto,
  UpdateDraftPickTradeDto,
} from '../dtos/draft-pick-trade.dto';
import { DraftPickTradeMapper } from '../mappers/draft-pick-trade.mapper';

export class DraftPickTradesService {
  private draftPickTradesRepository =
    AppDataSource.getRepository(DraftPickTrade);
  private teamRepository = AppDataSource.getRepository(Team);
  private draftPickRepository = AppDataSource.getRepository(DraftPick);

  async getAllDraftPickTrades(filters?: {
    teamId?: string;
  }): Promise<DraftPickTradeResponseDto[]> {
    const queryBuilder = this.draftPickTradesRepository
      .createQueryBuilder('draftPickTrade')
      .leftJoinAndSelect('draftPickTrade.draftPick', 'draftPick')
      .leftJoinAndSelect('draftPickTrade.fromTeam', 'fromTeam')
      .leftJoinAndSelect('draftPickTrade.toTeam', 'toTeam');

    if (filters?.teamId) {
      queryBuilder.andWhere('fromTeam.id = :teamId OR toTeam.id = :teamId', {
        teamId: filters.teamId,
      });
    }

    const draftPickTrades = await queryBuilder.getMany();

    return draftPickTrades.map((trade) =>
      DraftPickTradeMapper.toResponseDto(trade),
    );
  }

  async getDraftPickTradeById(id: string): Promise<DraftPickTradeResponseDto> {
    const draftPickTrade = await this.draftPickTradesRepository.findOne({
      where: { id },
      relations: ['draftPick', 'fromTeam', 'toTeam'],
    });

    if (!draftPickTrade) {
      throw new Error(`Draft pick trade with id ${id} not found`);
    }

    return DraftPickTradeMapper.toResponseDto(draftPickTrade);
  }

  async createDraftPickTrade(
    dto: CreateDraftPickTradeDto,
  ): Promise<DraftPickTradeResponseDto> {
    const draftPick = await this.draftPickRepository.findOneBy({
      id: dto.draftPickId,
    });
    if (!draftPick) {
      throw new Error(`Draft pick with id ${dto.draftPickId} not found`);
    }

    const fromTeam = await this.teamRepository.findOneBy({
      id: dto.fromTeamId,
    });
    if (!fromTeam) {
      throw new Error(`Team with id ${dto.fromTeamId} not found`);
    }

    const toTeam = await this.teamRepository.findOneBy({ id: dto.toTeamId });
    if (!toTeam) {
      throw new Error(`Team with id ${dto.toTeamId} not found`);
    }

    const draftPickTrade = DraftPickTradeMapper.toEntity(
      dto,
      draftPick,
      fromTeam,
      toTeam,
    );
    const savedDraftPickTrade = await this.draftPickTradesRepository.save(
      draftPickTrade,
    );

    return DraftPickTradeMapper.toResponseDto(savedDraftPickTrade);
  }

  async updateDraftPickTrade(
    id: string,
    dto: UpdateDraftPickTradeDto,
  ): Promise<DraftPickTradeResponseDto> {
    const draftPickTrade = await this.draftPickTradesRepository.findOne({
      where: { id },
      relations: ['draftPick', 'fromTeam', 'toTeam'],
    });

    if (!draftPickTrade) {
      throw new Error(`Draft pick trade with id ${id} not found`);
    }

    const draftPick =
      dto.draftPickId && dto.draftPickId !== draftPickTrade.draftPick.id
        ? await this.draftPickRepository.findOneBy({ id: dto.draftPickId })
        : undefined;

    const fromTeam =
      dto.fromTeamId && dto.fromTeamId !== draftPickTrade.fromTeam.id
        ? await this.teamRepository.findOneBy({ id: dto.fromTeamId })
        : undefined;

    const toTeam =
      dto.toTeamId && dto.toTeamId !== draftPickTrade.toTeam.id
        ? await this.teamRepository.findOneBy({ id: dto.toTeamId })
        : undefined;

    const updatedDraftPickTrade = DraftPickTradeMapper.toUpdateEntity(
      draftPickTrade,
      dto,
      draftPick,
      fromTeam,
      toTeam,
    );

    const savedDraftPickTrade = await this.draftPickTradesRepository.save(
      updatedDraftPickTrade,
    );

    return DraftPickTradeMapper.toResponseDto(savedDraftPickTrade);
  }

  async deleteDraftPickTrade(id: string): Promise<void> {
    const draftPickTrade = await this.draftPickTradesRepository.findOneBy({
      id,
    });

    if (!draftPickTrade) {
      throw new Error(`Draft pick trade with id ${id} not found`);
    }

    await this.draftPickTradesRepository.delete(draftPickTrade);
  }
}
