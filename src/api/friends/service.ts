import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendsRequestDto } from './dtos/create-friends-request.dto';
import { Any, DataSource, In, Not } from 'typeorm';
import { ContactRecord } from '../../entity/contact_request_records.entity';
import { DeletedStatus, RecordStatus } from '../../type/RecordStatus';

@Injectable()
export class FriendsService {
  constructor(private dataSource: DataSource) {}
  async create(uid: number, createFriendsRequestDto: CreateFriendsRequestDto) {
    const { fid, uGroupId, senderRemark, senderDesc } = createFriendsRequestDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const existRecord = await queryRunner.manager.findOne(ContactRecord, {
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
      const record = await queryRunner.manager.save(ContactRecord, {
        uid: uid,
        fid: fid,
        uGroupId: uGroupId,
        senderRemark: senderRemark,
        senderDesc: senderDesc,
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

  async getRecords(uid: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const records = await queryRunner.manager.find(ContactRecord, {
      where: [
        {
          uid: uid,
          deleted: In([DeletedStatus.Nothing, DeletedStatus.FriendDeleted]),
        },
        {
          fid: uid,
          deleted: In([DeletedStatus.Nothing, DeletedStatus.UserDeleted]),
        },
      ],
    });
    await queryRunner.release();
    return records;
  }
}
