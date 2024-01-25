import { DataTypes, Model, Sequelize } from "sequelize";
import { commonModel, commonOptions } from './common.model.js';


export default (sequelize) => {
    class Customer extends Model { }

    Customer.init(
        {
            ...commonModel,
            names: {
                type: DataTypes.STRING,
                allowNull: false
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
            city: {
                type: DataTypes.STRING
            },
            address: {
                type: DataTypes.STRING
            },
            phone: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
        },
        { ...commonOptions, modelName: 'customer', sequelize }
    );
    Customer.beforeSync(() => console.log('before creaing the table'));
    Customer.afterSync(() => console.log('before creaing the table'));

    return Customer;
}