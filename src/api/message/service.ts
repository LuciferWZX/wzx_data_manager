import { Injectable } from '@nestjs/common';
import { DataSource, LessThan, MoreThan } from 'typeorm';
import { WsGateway } from '../../gateway/ws/ws.gateway';
import { MessageType } from '../../type/message/MessageType';
import { Message } from '../../entity/message.entity';

@Injectable()
export class MessageService {
  constructor(private dataSource: DataSource, private wsGateway: WsGateway) {}

  /**
   * 一对一发送消息
   */
  async create(
    uid: number,
    params: {
      fid: number;
      reminder: boolean;
      type: MessageType;
      content: string;
    },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const msgRecord = new Message();
    const { fid, type, content, reminder } = params;
    msgRecord.receiverId = fid;
    msgRecord.senderId = uid;
    msgRecord.content = content;
    msgRecord.messageType = type;
    const record = await queryRunner.manager.save(Message, msgRecord);
    await queryRunner.release();
    return record;
  }

  async queryMessage(
    uid: number,
    fid: number,
    config?: {
      pageSize: number;
      page: number;
      currentTime: string;
    },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const messages = await queryRunner.manager.find(Message, {
      where: [
        {
          senderId: uid,
          receiverId: fid,
          senderDeleted: false,
          deletedDate: null,
          createDate: LessThan(config.currentTime),
        },
        {
          senderId: fid,
          receiverId: uid,
          receiverDeleted: false,
          deletedDate: null,
          createDate: LessThan(config.currentTime),
        },
      ],
      order: {
        createDate: 'asc',
      },
      skip:
        config.pageSize && config.page
          ? config?.pageSize * (config?.page - 1)
          : undefined,
      take: config.pageSize,
    });
    const total = await queryRunner.manager.count(Message, {
      where: [
        {
          senderId: uid,
          receiverId: fid,
          senderDeleted: false,
          deletedDate: null,
          createDate: LessThan(config.currentTime),
        },
        {
          senderId: fid,
          receiverId: uid,
          receiverDeleted: false,
          deletedDate: null,
          createDate: LessThan(config.currentTime),
        },
      ],
    });
    const totalPage = config?.pageSize ? Math.ceil(total / config.pageSize) : 1;
    await queryRunner.release();
    return {
      total,
      pageTotal: totalPage,
      data: messages,
    };
  }
}
