import { DataTypes, Model, Sequelize } from "sequelize";
import { commonModel, commonOptions } from './common.model.js';


export default (sequelize) => {
    class User extends Model { }

    User.init(
        {
            ...commonModel,
            names: {
                type: DataTypes.STRING
            },
            document: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isNumeric: true,
                    isExactLength(value) {
                        const numDigits = String(value).length;
                        if (numDigits !== 10) {
                            throw new Error('El campo numérico debe tener exactamente 10 dígitos.');
                        }
                    },
                }
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            retriesPassword: {
                type: DataTypes.TINYINT,
            },
            timerDisableAccount: {
                type: DataTypes.DATE,
            },
            state: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            }
        },
        { ...commonOptions, modelName: 'user', sequelize }
    );
    User.beforeSync(() => console.log('before creaing the table'));
    User.afterSync(() => console.log('before creaing the table'));

    return User;
}