import { DataTypes, Model, Sequelize } from "sequelize";
import { commonModel, commonOptions } from './common.model.js';


export default (sequelize) => {
    class Quote extends Model { }

    Quote.init(
        {
            ...commonModel,
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            discountType: {
                type: DataTypes.ENUM(['Percentage', 'Standard']),
                validate: {
                    correctDiscount(value) {
                        if (!['Percentage', 'Standard'].includes(value)) {
                            throw new Error(`Quote discount type must be one of ${['Percentage', 'Standard'].toString()}`);
                        }
                    }
                }
            },
            discount: {
                type: DataTypes.FLOAT,
            },
            total: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            subTotal: {
                type: DataTypes.INTEGER,
            },
            deliveryType: {
                type: DataTypes.ENUM(['Premium', 'Paid', 'Standard']),
                allowNull: false,
                validate: {
                    correctDiscount(value) {
                        if (!['Premium', 'Paid', 'Standard'].includes(value)) {
                            throw new Error(`Quote delivery type must be one of ${['Premium', 'Paid', 'Standard'].toString()}`);
                        }
                    }
                }
            },
            state: {
                type: DataTypes.ENUM(['Created', 'Canceled', 'Completed']),
                allowNull: false,
                validate: {
                    correctDiscount(value) {
                        if (!['Created', 'Canceled', 'Completed'].includes(value)) {
                            throw new Error(`Quote state must be ${['Created', 'Canceled', 'Completed'].toString()}`);
                        }
                    }
                }
            }
        },
        { ...commonOptions, modelName: 'quote', sequelize }
    );
    Quote.beforeSync(() => console.log('before creaing the table'));
    Quote.afterSync(() => console.log('before creaing the table'));

    return Quote;
}