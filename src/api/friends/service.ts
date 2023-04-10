import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendsRequestDto } from './dtos/create-friends-request.dto';
import { DataSource, Not } from 'typeorm';
import { Contact } from '../../entity/contact_request_records.entity';
import { RecordStatus } from '../../type/RecordStatus';

@Injectable()
export class FriendsService {
  constructor(private dataSource: DataSource) {}
  async create(createFriendsRequestDto: CreateFriendsRequestDto) {
    const { uid, fid, uGroupId, senderRemark } = createFriendsRequestDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const existRecord = await queryRunner.manager.findOne(Contact, {
      where: [
        {
          uid: uid,
          fid: fid,
          status: Not(RecordStatus.Reject),
        },
        {
          uid: fid,
          fid: uid,
          status: Not(RecordStatus.Reject),
        },
      ],
    });
    if (existRecord) {
      if (existRecord.status === RecordStatus.Accept) {
        await queryRunner.release();
        throw new HttpException(
          '你们已经是好友，无法重复添加好友',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (existRecord.status === RecordStatus.Waiting) {
        await queryRunner.release();
        throw new HttpException(
          '已经发送请求，等待对方回复',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      const record = await queryRunner.manager.save(Contact, {
        uid: uid,
        fid: fid,
        uGroupId: uGroupId,
        senderRemark: senderRemark,
      });
      return {
        id: record.id,
      };
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }
}
