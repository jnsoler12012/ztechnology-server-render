import { DataTypes, Model } from "sequelize";
import { commonModel, commonOptions } from './common.model.js';

const typesProduct = [
    'motherboard',
    'ram',
    'cpu',
    'powerSupply',
    'graphicCard'
]

export default (sequelize) => {
    class Product extends Model { }

    Product.init(
        {
            ...commonModel,
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM([...typesProduct]),
                allowNull: false,
                validate: {
                    correctType(value) {
                        if (!typesProduct.includes(value)) {
                            throw new Error(`Product type must be one of ${typesProduct.toString()}`);
                        }
                    }
                }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            available: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            }
        },
        { ...commonOptions, modelName: 'product', sequelize }
    );
    Product.beforeSync(() => console.log('before creaing the table'));
    Product.afterSync(() => console.log('before creaing the table'));

    return Product;
}