
import { Customer } from "../../models/index.js";
import errorController from "../errorController.js";

export default async (req, res) => {
    console.log("=====_____Peticion recibida para modificar")

    let idRequired = req.params?.idCustomer
    const { names, document, email, city, address, phone } = req.body

    let attrModify = {}

    if (names)
        attrModify['names'] = names

    if (document)
        attrModify['document'] = document

    if (email)
        attrModify['email'] = email

    if (city)
        attrModify['city'] = city

    if (address)
        attrModify['address'] = address

    if (phone)
        attrModify['phone'] = phone

    try {
        const customerId = await Customer.findAll({ where: { id: idRequired } });

        if (customerId.length <= 0)
            throw {
                message: "Requested Modify Customer does not exist",
                status: 400,
                path: `IdCustomerRequested ${idRequired}`
            }

        const customer = await Customer.update({ ...attrModify }, {
            where: { id: idRequired }
        })

        console.log(customer.length)
        return res.status(200).json({
            success: true,
            message: "Customer modified succesfully"
        })

    } catch (error) {
        console.log(error);
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}