import { User } from '../../entity/user.entity';

export type ResContact = {
  id: number;
  fid: number;
  friendInfo: User;
  groupId: number;
  createDate: string;
  updateDate: string;
};
