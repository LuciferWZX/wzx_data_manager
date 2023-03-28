import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../redis/redis.service';

/**
 * 前端事例
 * const socket = io("http://localhost:80/dm",{
 *             transports: ["websocket", "polling"],
 *             auth:{
 *                 uid:id,
 *                 token:token
 *             }
 *         })
 */
@WebSocketGateway(80, {
  namespace: 'dm',
})
export class WsGateway {
  USERS_ONLINE_ALL = 'user_online_all';
  @WebSocketServer() server: Server;

  constructor(private redisService: RedisService) {}
  /**
   * 连接
   * @param client
   */
  async handleConnection(client: Socket) {
    const uid = client.handshake.auth['uid'];
    await this.redisService.hSet(this.USERS_ONLINE_ALL, uid, client.id);
    console.log(`与服务器链接已建立,uid:${uid}`);
  }

  /**
   * 断开连接
   * @param client
   */
  async handleDisconnect(client: Socket) {
    const uid = client.handshake.auth['uid'];
    await this.redisService.hDel(this.USERS_ONLINE_ALL, uid);
    console.log(`与服务器链接已断开,uid:${uid}`);
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(payload.message);
    // 发送网页的数据给flutter端
    // client.emit('toflutter', payload.message)
    this.server.emit('toflutter', payload.message);
  }
}
