export enum RecordStatus {
  Accept = 'accept', //接受
  Reject = 'reject', //拒绝
  Waiting = 'waiting', //等待处理
}
export enum DeletedStatus {
  Nothing = 'nothing', //两人都没删除这条记录
  UserDeleted = 'user_deleted', //发送者删除这条记录
  FriendDeleted = 'friend_deleted', //接收者删除这条记录
  BothDeleted = 'both_deleted', //两人都删除这条记录
}
