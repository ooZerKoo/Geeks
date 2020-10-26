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
            // usuarios
            {id: 1001, value: 'Rellena las contraseñas'},
            {id: 1002, value: 'Rellena los campos necesarios'},
            {id: 1003, value: 'Las contraseñas no coinciden'},
            {id: 1004, value: 'El nombre de usuario es necesario'},
            {id: 1005, value: 'El nombre de usuario tienes que ser de ' + process.env.LOGIN_LEN + ' o más caracteres'},
            {id: 1006, value: 'El e-mail es necesario'},
            {id: 1007, value: 'El nombre de usuario ya está registrado'},
            {id: 1008, value: 'El e-mail ya está registrado'},
            {id: 1009, value: 'La contraseña tiene que ser de ' + process.env.PASSWD_LEN + ' o más caracteres'},
            {id: 1010, value: 'Usuario no encontrado'},
            {id: 1011, value: 'Contraseña Incorrecta'},
            {id: 1030, value: 'No tienes permisos para entrar'},

            // productos
            {id: 2001, value: 'Producto eliminado correctamente'},
            {id: 2002, value: 'Error al eliminar el Producto'},
            {id: 2003, value: 'Rellena el nombre'},
            {id: 2004, value: 'Rellena el Enlace Amigable'},
            {id: 2005, value: 'El Enlace Amigable ya existe'},
            {id: 2006, value: 'El Precio es necesario'},
            {id: 2007, value: 'La Categoría es necesaria'},
            {id: 2008, value: 'La cantidad es necesaria'},

            // categorias
            {id: 3001, value: 'Rellena los campos'},
            {id: 3002, value: 'Error al eliminar la categoría'},
            {id: 3003, value: 'Rellena el nombre'},
            {id: 3004, value: 'Rellena el Enlace Amigable'},
            {id: 3005, value: 'El Enlace Amigable ya existe'},
            {id: 3006, value: 'No se ha podido actualizar la categoría'},
            {id: 3007, value: 'No se ha podido guardar la categoría'},
            
        ]
    },
    successList () {
        return [
            // usuarios
            {id: 1001, value: 'Token Eliminado'},
            {id: 1002, value: 'Token Creado'},
            {id: 1003, value: 'Contraseña actualizada correctamente'},
            {id: 1004, value: 'Cuenta creada correctamente'},

            // productos
            {id: 2001, value: 'Producto actualizado correctamente'},
            {id: 2002, value: 'No se ha podido actualizar el Producto'},
            {id: 2003, value: 'Producto creado correctamente'},
            {id: 2004, value: 'No se ha podido guardar el Producto'},
            
            // categorias
            {id: 3001, value: 'Categoría eliminada correctamente'},
            {id: 3002, value: 'Categoría actualizada correctamente'},
            {id: 3003, value: 'Categoría creada correctamente'},

            // carrito
            {id: 4001, value: 'Producto borrado del carrito'},
            {id: 4002, value: 'Producto añadido  del carrito'}
        ]
    }
}


module.exports = MessageController;