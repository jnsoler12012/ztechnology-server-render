import { DataTypes } from "sequelize";

const commonModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
};

const commonOptions = {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};

export { commonModel, commonOptions };
