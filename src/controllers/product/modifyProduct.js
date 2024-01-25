import { Product } from "../../models/index.js";
import errorController from "../errorController.js";




export default async (req, res) => {
    console.log("=====_____Peticion recibida para modificar prodicto", req.body)

    let idRequired = parseInt(req.params?.idProduct)
    let { name, description, price, type, counterProduct, idsAssociated, idRequester } = req.body

    console.log(name, description, price, type, counterProduct, idsAssociated, idRequired);


    try {
        const productId = await Product.findOne({ where: { id: idRequired } });

        if (!productId || productId.length <= 0)
            throw {
                message: "Requested Modify Product does not exist",
                status: 400,
                path: `IdProductRequested ${idRequired}`
            }

        if (counterProduct == -1) {
            console.log(idsAssociated);

            await Product.destroy({
                where: {
                    id: idsAssociated
                }
            })

            return res.status(200).json({
                success: true,
                message: "Product modified succesfully"
            })
        } else if (counterProduct == idsAssociated.length) {
            await Product.update({ name, description, price, type, available: true }, {
                where: { id: idsAssociated }
            })

            return res.status(200).json({
                success: true,
                message: "Product/s modified succesfully"
            })
        } else if (counterProduct == 0) {
            let copyIdAssociated = [...idsAssociated]
            console.log(copyIdAssociated, copyIdAssociated.indexOf(idRequired));
            if (copyIdAssociated.indexOf(idRequired) != -1) {
                copyIdAssociated.splice(copyIdAssociated.indexOf(idRequired), 1)
            }

            console.log(copyIdAssociated, copyIdAssociated.indexOf(idRequired));
            await Product.update({ name, description, price, type, available: false }, {
                where: { id: idRequired }
            })

            await Product.destroy({
                where: {
                    id: copyIdAssociated
                }
            })

            return res.status(200).json({
                success: true,
                message: "Product/s modified succesfully"
            })
        } else if (counterProduct < idsAssociated.length) {
            console.log(idsAssociated);
            let copyIdAssociated = [...idsAssociated]
            console.log(copyIdAssociated, copyIdAssociated.indexOf(idRequired));
            if (copyIdAssociated.indexOf(idRequired) != -1) {
                copyIdAssociated.splice(copyIdAssociated.indexOf(idRequired), 1)
            }
            let modifyProducts = copyIdAssociated.splice(0, --counterProduct)
            let deleteProducts = copyIdAssociated

            console.log(deleteProducts, modifyProducts, idRequired);

            await Product.update({ name, description, price, type, available: true }, {
                where: { id: [...modifyProducts, idRequired] }
            })

            await Product.destroy({
                where: {
                    id: deleteProducts
                }
            })

            return res.status(200).json({
                success: true,
                message: "Product/s modified succesfully"
            })
        } else if (counterProduct > idsAssociated.length) {
            let counterNewProducts = counterProduct - idsAssociated.length
            let objAttributesProduct = []
            console.log(idsAssociated, counterNewProducts);

            for (let x = 0; x < counterNewProducts; x++)
                objAttributesProduct.push({ name, description, price, type, available: true, userId: idRequester })

            console.log(objAttributesProduct);

            await Product.update({ name, description, price, type, available: true }, {
                where: { id: idsAssociated }
            })

            await Product.bulkCreate(objAttributesProduct)

            return res.status(200).json({
                success: true,
                message: "Product/s modified and created succesfully"
            })
        }

        throw {
            message: "Problem not specified, please contact your ADMIN",
            status: 400,
            path: `IdProductRequested ${idRequired}`
        }

    } catch (error) {
        console.log(error);
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}