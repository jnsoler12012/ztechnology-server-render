import { ValidationError } from "sequelize";

export default function (error, res) {
    let messageError = {

    };
    if (error instanceof ValidationError) {
        const { errors } = error
        //console.log("!@##@!@#!!#@#!@!#@#@!!@#!#@#@!#@!!@#", errors, error)

        let arrayErrors = []

        errors.forEach(errorItem => {
           
            const { message, path, value } = errorItem
            const errorItemObj = {
                message,
                path: `${path} ${value}`
            }
            //console.log("11111111111111111111111111", errorItemObj);
            arrayErrors.push(errorItemObj)
        })

        messageError = {
            message: "SEQ_ERROR",
            data: arrayErrors
        }


    } else {
        const { message, status, path } = error;
        messageError = {
            message, status, path
        }
    }

    return res.status(error.status).json(
        messageError
    )
}