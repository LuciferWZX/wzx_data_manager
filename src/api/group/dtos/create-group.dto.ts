export class CreateGroupDto {
  name: string; //群名称
  desc?: string; //群描述
  members: number[]; //群成员的id
  admins: number[]; //设为管理员的id
}
