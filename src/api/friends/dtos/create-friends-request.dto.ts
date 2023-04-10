export class CreateFriendsRequestDto {
  uid: number; //发送者的id
  fid: number; //接受者的id
  uGroupId: number; //接收者默认发送者的分组id
  senderRemark: string; //发送者向接收者发送一条备注
}
