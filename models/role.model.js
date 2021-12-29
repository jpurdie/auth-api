export default function (sequelize, DataTypes) {
  const Role = sequelize.define(
    'roles',
    {
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
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
        attributes: { exclude: ['id'] },
      },
    }
  );

  return Role;
}
