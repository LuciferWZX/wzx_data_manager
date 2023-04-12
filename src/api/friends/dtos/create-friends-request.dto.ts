export class CreateFriendsRequestDto {
  fid: number; //接受者的id
  uGroupId: number; //接收者默认发送者的分组id
  senderRemark: string; //发送者对接收者进行的备注
  senderDesc: string; //发送者向接收者发送一条为啥加你
}
