import { Sequelize } from "sequelize";

const URL = process.env.WEBPACK_URL_DB || 'postgres://mainuser:8AQluCn0KKyEy7FSqXnCiyG1rEwn0nEd@dpg-cmni2nmn7f5s73ct39h0-a.oregon-postgres.render.com/ztechnology_db';

console.log(URL);

const dataBaseConnection = new Sequelize(URL, {
    dialectOptions: {
        ssl: true,
        useUTC: true, // -->Add this line. for reading from database
    },
    timezone: '-05:00', // -->Add this line. for writing to database
})

// const dataBaseConnection = new Sequelize('dbztechnology2', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
//     dialectOptions: {
//         useUTC: true, // -->Add this line. for reading from database
//     },
//     timezone: '-05:00', // -->Add this line. for writing to database
// })

export default dataBaseConnection