import {default as UserInit} from './user.model.js'
import {default as QuoteInit} from './quote.model.js'
import {default as RoleInit} from './role.model.js'
import {default as CustomerInit} from './customer.model.js'
import {default as ProductInit} from './product.model.js'
import dataBaseConnection from '../DB/dataBaseConnection.js'

const Role = RoleInit(dataBaseConnection)
const User = UserInit(dataBaseConnection)
const Quote = QuoteInit(dataBaseConnection)
const Customer = CustomerInit(dataBaseConnection)
const Product = ProductInit(dataBaseConnection)

export {
    User,
    Quote,
    Role,
    Customer,
    Product
}