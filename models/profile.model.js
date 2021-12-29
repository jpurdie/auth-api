import User from './user.model';
import Organization from './organization.model';

export default function (sequelize, DataTypes) {
  const Profile = sequelize.define(
    'profiles',
    {
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
      },
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        references: {
          model: Organization,
          key: 'id',
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['id', 'externalSub'] },
      },
    }
  );

  return Profile;
}
