import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendsRequestDto } from './dtos/create-friends-request.dto';
import { DataSource, In, Not } from 'typeorm';
import { ContactRecord } from '../../entity/contact_request_records.entity';
import { DeletedStatus, RecordStatus } from '../../type/RecordStatus';
import { User } from '../../entity/user.entity';
import { WsGateway } from '../../gateway/ws/ws.gateway';
import { ResFriendsRecord } from '../../type/friends/ResFriendsRecord';
import { Contact } from '../../entity/contact.entity';
import { ResContact } from '../../type/friends/ResContact';

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
    let records: ResFriendsRecord[] = [];
    const senderRecords = await queryRunner.manager.find(ContactRecord, {
      where: [
        {
          uid: uid,
          deleted: In([DeletedStatus.Nothing, DeletedStatus.FriendDeleted]),
        },
      ],
      relations: {
        rProfile: true,
      },
    });
    records = senderRecords.map((_record) => {
      return {
        id: _record.id,
        fid: _record.fid,
        creatorId: uid,
        groupId: _record.uGroupId,
        senderDesc: _record.senderDesc,
        senderRemark: _record.senderRemark,
        status: _record.status,
        rejectReason: _record.rejectReason,
        createDate: _record.createDate,
        deleted: _record.deleted,
        friendInfo: _record.rProfile,
      };
    });
    const receiverRecords = await queryRunner.manager.find(ContactRecord, {
      where: [
        {
          fid: uid,
          deleted: In([DeletedStatus.Nothing, DeletedStatus.UserDeleted]),
        },
      ],
      relations: {
        sProfile: true,
      },
    });
    records = records.concat(
      ...receiverRecords.map((_record) => {
        return {
          id: _record.id,
          fid: _record.uid,
          creatorId: _record.uid,
          groupId: 1, //默认好友
          senderDesc: _record.senderDesc,
          senderRemark: _record.senderRemark,
          status: _record.status,
          rejectReason: _record.rejectReason,
          createDate: _record.createDate,
          deleted: _record.deleted,
          friendInfo: _record.sProfile,
        };
      }),
    );
    await queryRunner.release();
    return records;
  }

  async handleContactRecord(
    uid: number,
    groupId: number,
    recordId: number,
    status: RecordStatus.Accept | RecordStatus.Reject,
    rejectReason?: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const record = await queryRunner.manager.findOne(ContactRecord, {
        where: {
          id: recordId,
        },
      });
      //如果该条记录不存在
      if (!record) {
        throw new HttpException('该条记录不存在', HttpStatus.BAD_REQUEST);
      }
      //现将记录表的状态改一下
      await queryRunner.manager.update(ContactRecord, recordId, {
        status: status,
        rejectReason: rejectReason ?? null,
      });
      const contact = new Contact();
      const u1 = await queryRunner.manager.findOne(User, {
        where: {
          id: record.uid,
        },
      });
      const f1 = await queryRunner.manager.findOne(User, {
        where: {
          id: record.fid,
        },
      });
      let _id = uid;
      if (status === RecordStatus.Accept) {
        contact.uid = record.uid;
        contact.fid = record.fid;
        //只有是接受状态
        if (record.uid === uid) {
          //说明我是创建者，我是发送者
          _id = record.fid;
          contact.uGroupId = groupId;
          contact.fGroupId = record.uGroupId;
          contact.uProfile = f1;
          contact.fProfile = u1;
        } else {
          //我是接受者
          _id = record.uid;
          contact.uGroupId = record.uGroupId;
          contact.fGroupId = groupId;
          contact.uProfile = u1;
          contact.fProfile = f1;
        }
        //然后插入数据
        await queryRunner.manager.save(Contact, contact);
      }
      await queryRunner.commitTransaction();
      //通知对方接受状态
      this.wsGateway.server
        .to(_id.toString())
        .emit('friend-record-changed', record);
    } catch (e) {
      console.log('[出错了：]:', e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getContact(uid: number): Promise<ResContact[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const uContacts = await queryRunner.manager.find(Contact, {
      where: { uid: uid },
      relations: {
        fProfile: {
          ban: true,
        },
      },
    });
    const fContacts = await queryRunner.manager.find(Contact, {
      where: { fid: uid },
      relations: {
        uProfile: {
          ban: true,
        },
      },
    });
    await queryRunner.release();
    return uContacts.concat(fContacts).map((contact) => {
      if (contact.uid === uid) {
        return {
          id: contact.id,
          fid: contact.fid,
          groupId: contact.uGroupId,
          friendInfo: contact.fProfile,
          createDate: contact.createDate,
          updateDate: contact.updateDate,
        };
      }
      return {
        id: contact.id,
        fid: contact.uid,
        groupId: contact.fGroupId,
        friendInfo: contact.uProfile,
        createDate: contact.createDate,
        updateDate: contact.updateDate,
      };
    });
  }
}
