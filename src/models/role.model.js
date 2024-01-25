import { DataTypes, Model, Sequelize } from "sequelize";
import { commonModel, commonOptions } from './common.model.js';

export default (sequelize) => {
    class Role extends Model { }

    Role.init(
        {
            ...commonModel,
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING
            }
        },
        { ...commonOptions, modelName: 'role', sequelize }
    );
    Role.beforeSync(() => console.log('before creaing the table'));
    Role.afterSync(() => console.log('before creaing the table'));

    return Role;
}