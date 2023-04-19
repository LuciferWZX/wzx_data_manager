import { DataSource, In } from 'typeorm';
import { WsGateway } from '../../gateway/ws/ws.gateway';
import { User } from '../../entity/user.entity';
import { Group } from '../../entity/group.entity';

export class GroupService {
  constructor(private dataSource: DataSource, private wsGateway: WsGateway) {}

  async create(
    uid: number,
    params: {
      name: string;
      desc?: string;
      members: number[];
      admins: number[];
    },
  ) {
    const { members, desc, admins } = params;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const users = await queryRunner.manager.find(User, {
        where: {
          id: In(members),
        },
      });
      const group = new Group();
      group.participants = users;
      group.creatorId = uid;
      group.desc = desc;
      group.admins = users.filter((user) => admins.includes(user.id));
      await queryRunner.manager.save(Group);
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(['插入group出错:', e]);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
