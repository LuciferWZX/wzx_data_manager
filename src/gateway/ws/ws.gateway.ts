import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway(81)
export class WsGateway {
  @SubscribeMessage('hello')
  hello(@MessageBody() data: any): any {
    return {
      event: 'hello',
      data: data,
      msg: 'rustfisher.com',
    };
  }
}
