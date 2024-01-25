import cors from "cors";
import express from "express";
import dataBaseConnection from "./DB/dataBaseConnection.js"
import { Customer, Product, Quote, Role, User } from "./models/index.js";
import { authRouter, customerRouter, userRouter, productRouter, quoteRouter } from "./routes/index.js";

const defineRelations = () => {
    const common = (options) => ({
        ...options,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    Role.hasOne(User, common({ foreignKey: 'roleId' }))
    User.belongsTo(Role);

    User.hasMany(Customer, common({ foreignKey: 'userId' }))
    Customer.belongsTo(User);

    User.hasMany(Product, common({ foreignKey: 'userId' }))
    Product.belongsTo(User);

    

    Product.belongsToMany(Quote, common({ through: 'products_quotes' }));
    Quote.belongsToMany(Product, common({ through: 'products_quotes' }));

    Customer.hasMany(Quote, common({ foreignKey: 'customerId' }))
    Quote.belongsTo(Customer);

    User.hasMany(Quote, common({ foreignKey: 'userId' }))
    Quote.belongsTo(User);
    
}

export default function server() {
    var app;
    const port = process.env.PORT;

    const paths = {
        auth: '/api/auth',
        user: '/api/user',
        roles: '/api/role',
        product: '/api/product',
        customer: '/api/customer',
        quote: '/api/quote'
    }

    app = express();

    app.use(express.json());
    app.use(cors());

    app.use(paths.auth, authRouter);

    app.use(paths.user, userRouter);

    app.use(paths.customer, customerRouter)

    app.use(paths.product, productRouter)

    app.use(paths.quote, quoteRouter)


    const dbConnection = async () => {
        try {

            await dataBaseConnection
                .authenticate()
                .then(async () => {
                    defineRelations()
                    await dataBaseConnection.sync({ force: false })
                })
                .catch((err) => {
                    console.error(err);
                });

            Role.findOrCreate({
                where: { name: "ADMIN" },
                defaults: { name: "ADMIN", description: "Admin with priviligies over normal user" }
            })
            Role.findOrCreate({
                where: { name: "USER" },
                defaults: { name: "USER", description: "Regular user with actions with no priviligies" }
            })

            console.log('DB connected');
        } catch (error) {
            console.log(error);
        }
    }

    dbConnection();

    app.listen(port, () => {
        console.log(`App is executing on port${port}`);
    })
}