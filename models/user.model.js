export default function (sequelize, DataTypes) {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      externalSub: DataTypes.TEXT,
      email: DataTypes.TEXT,
      givenName: DataTypes.TEXT,
      familyName: DataTypes.TEXT,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
      },
    },
    {
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['id', 'externalSub'] },
      },
    }
  );

  return User;
}
