export default function (sequelize, DataTypes) {
  const Organization = sequelize.define(
    'organizations',
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
      name: DataTypes.TEXT,
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

  return Organization;
}
