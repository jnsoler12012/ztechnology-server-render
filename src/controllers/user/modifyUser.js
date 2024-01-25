import { User, Role } from '../../models/index.js'
import bcrypt from 'bcrypt'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=-=-=--=-=-=-=-=Peticion recibida para modificar usuario", req.body)

    let idRequired = req.params?.idUser

    let { names, document, email, password, roleId, state, idRequester } = req.body


    let attrModify = {}

    if (names)
        attrModify['names'] = names

    if (document)
        attrModify['document'] = document

    if (email)
        attrModify['email'] = email

    if (password)
        attrModify['password'] = await bcrypt.hash((password) ? password : "", 10);

    if (roleId)
        attrModify['roleId'] = (roleId == 'ADMIN' ? 1 : roleId == 'USER' ? 2 : 2)

    if (state !== null)
        attrModify['state'] = state

    console.log(attrModify['roleId'], idRequester, idRequired);
    try {
        const userRequester = await User.findOne({
            where: {
                id: [idRequester]
            },
            include: [
                { model: Role, attributes: { exclude: ['createdAt', 'updatedAt'] } }
            ],
        })

        console.log("_+_+_+_+_", userRequester, userRequester?.dataValues?.role?.dataValues)

        if (!userRequester)
            throw {
                message: "Requester User does not exists",
                status: 400,
                path: `IdUserRequester ${idRequester}`
            }

        const userRequested = await User.findOne({
            where: {
                id: [idRequired]
            },
            include: [
                { model: Role, attributes: { exclude: ['password', 'retriesPassword', 'timerDisableAccount', 'state'] } }
            ],
        })

        if (!userRequested)
            throw {
                message: "Requested Modify User does not exists",
                status: 400,
                path: `IdUserRequested ${idRequired}`
            }

        let requesterRole = userRequester?.dataValues?.role?.dataValues?.name
        let requestedRole = userRequested?.dataValues?.role?.dataValues?.name

        let userChanged

        if (requesterRole == 'ADMIN') {

            if (attrModify['state'] == 'true') {
                attrModify['timerDisableAccount'] = new Date().addMinutes(-20)
                attrModify['retriesPassword'] = 3
            }

            console.log(attrModify);
            await User.update({ ...attrModify }, {
                where: {
                    id: idRequired
                }
            })
            return res.status(200).json({
                success: true,
                message: "User modified succesfully",
                data: {
                    "id": idRequired,
                    "names": attrModify['names'],
                    "document": attrModify['document'],
                    "email": attrModify['email'],
                    "state": attrModify['state'],
                    "role": requesterRole,
                    "createdAt": userRequester?.dataValues?.createdAt
                }
            })
        }
        else {
            if (attrModify['roleId'] == 1) {
                throw {
                    message: "Users can not change their own role status, please ask to a Admin manager",
                    status: 401,
                    path: `roleRequired ${idRequired},IdRequester ${idRequester}`
                }
            }
            if (idRequired === idRequester) {
                userChanged = await User.update({ ...attrModify }, {
                    where: {
                        id: idRequired
                    }
                })
            } else {
                throw {
                    message: "Users can change information only of their own user",
                    status: 401,
                    path: `IdRequired ${idRequired},IdRequester ${idRequester}`
                }
            }

            return res.status(200).json({
                success: true,
                message: "User modified succesfully",
                data: {
                    "id": idRequired,
                    "names": attrModify['names'],
                    "document": attrModify['document'],
                    "email": attrModify['email'],
                    "state": attrModify['state'],
                    "role": requesterRole,
                    "createdAt": userRequester?.dataValues?.createdAt
                }
            })
        }

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}