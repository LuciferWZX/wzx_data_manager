import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WsGateway } from '../../gateway/ws/ws.gateway';
import { MessageType } from "../../type/message/MessageType";

@Injectable()
export class MessageService {
  constructor(private dataSource: DataSource, private wsGateway: WsGateway) {}

  /**
   * 一对一发送消息
   */
  async create(
    uid: string,
    params: {
      fid: number;
      reminder: boolean;
      type:MessageType,
      content
    },
  ) {}
}
