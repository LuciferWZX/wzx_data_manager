import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendsRequestDto } from './dtos/create-friends-request.dto';
import { Any, DataSource, In, Not } from 'typeorm';
import { ContactRecord } from '../../entity/contact_request_records.entity';
import { DeletedStatus, RecordStatus } from '../../type/RecordStatus';
import { User } from '../../entity/user.entity';
import { WsGateway } from '../../gateway/ws/ws.gateway';

@Injectable()
export class FriendsService {
  constructor(private dataSource: DataSource, private wsGateway: WsGateway) {}
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
      const sUser = await queryRunner.manager.findOne(User, {
        where: [
          {
            id: uid,
          },
        ],
      });
      const rUser = await queryRunner.manager.findOne(User, {
        where: [
          {
            id: fid,
          },
        ],
      });
      const record = await queryRunner.manager.save(ContactRecord, {
        uid: uid,
        fid: fid,
        uGroupId: uGroupId,
        senderRemark: senderRemark,
        senderDesc: senderDesc,
        sProfile: sUser,
        rProfile: rUser,
      });
      console.log('aaaaaa', record);
      //请求好友成功，数据库通知，插入一条【好友请求】类型的通知这时候发送socket通知
      this.wsGateway.server
        .to(rUser.id.toString())
        .emit('update-friends-records', record);
      return {
        id: record.id,
      };
    } catch (err) {
      console.log('[出错：]', err);
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
      relations: {
        sProfile: true,
        rProfile: true,
      },
    });
    await queryRunner.release();
    return records;
  }
}
