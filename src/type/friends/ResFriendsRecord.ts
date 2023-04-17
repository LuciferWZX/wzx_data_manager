import { DeletedStatus, RecordStatus } from '../RecordStatus';
import { UserBasicProfile } from '../../entity/user_basic_profile';

export type ResFriendsRecord = {
  id: number;
  creatorId: number;
  fid: number;
  groupId: number;
  senderDesc: string;
  senderRemark: string;
  status: RecordStatus;
  rejectReason: string | null;
  createDate: string;
  deleted: DeletedStatus;
  friendInfo: UserBasicProfile;
};
