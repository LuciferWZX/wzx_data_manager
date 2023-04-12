export enum RecordStatus {
  Accept, //接受
  Reject, //拒绝
  Waiting, //等待处理
}
export enum DeletedStatus {
  Nothing, //两人都没删除这条记录
  UserDeleted, //发送者删除这条记录
  FriendDeleted, //接收者删除这条记录
  BothDeleted, //两人都删除这条记录
}
