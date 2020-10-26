const MessageController = {
    getError (id) {
        const list = MessageController.errorList()
        const message = list.filter(v => v.id == id)
        return message[0] ? message[0].value : 'Error no especificado'
    },
    getSuccess (id) {
        const list = MessageController.successList()
        const message = list.filter(v => v.id == id)
        return message[0] ? message[0].value : 'Todo Correcto'
    },
    errorList () {
        return [
            {id: 1, value: 'Rellena las contraseñas'},
            {id: 2, value: 'Rellena los campos necesarios'},
            {id: 3, value: 'Las contraseñas no coinciden'},
            {id: 4, value: 'El nombre de usuario es necesario'},
            {id: 5, value: 'El nombre de usuario tienes que ser de ' + process.env.LOGIN_LEN + ' o más caracteres'},
            {id: 6, value: 'El e-mail es necesario'},
            {id: 7, value: 'El nombre de usuario ya está registrado'},
            {id: 8, value: 'El e-mail ya está registrado'},
            {id: 9, value: 'La contraseña tiene que ser de ' + process.env.PASSWD_LEN + ' o más caracteres'},
            {id: 10, value: 'Usuario no encontrado'},
            {id: 11, value: 'Contraseña Incorrecta'},
            {id: 30, value: 'No tienes permisos para entrar'},
        ]
    },
    successList () {
        return [
            {id: 1, value: 'Token Eliminado'},
            {id: 2, value: 'Token Creado'},
            {id: 3, value: 'Contraseña actualizada correctamente'},
            {id: 4, value: 'Cuenta creada correctamente'},
        ]
    }
}


module.exports = MessageController;