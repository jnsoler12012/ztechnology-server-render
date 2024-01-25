Como desplegar de manera local:

Clonar server desde: https://github.com/jnsoler12012/ztechnology-server-render
Clonar client desde: https://github.com/jnsoler12012/ztechnology-client-firebase


Ejecutar en ambos:
npm run install –legacy-peer-deps

npm run start


Para la parte de el server, se abrirá una conexión en http://localhost: 8080/
Para la parte de el client, se abrirá una conexión en http://localhost:3000/


Para trabajar de manera global, se pueden usar las aplicaciones desde los siguientes links
Client = https://ztechnology-client-firebase.web.app/v1/public/login
Server = https://ztechnology-server-render.onrender.com

El client será redirijido a la pantalla de login para continuar con la aplicación normalmente

No se pueden crear usuarios sin estar previamente autenticado según requerimientos, solo usuarios administradores pueden entrar a la aplicación

Algunos de los requerimientos-que el usuario puede o no puede hacer una vez ingresado en la plataforma:








1.	Modificar Datos de Usuarios Gestores:
a.	Un administrador debe poder modificar los datos, incluida la contraseña, de usuarios gestores.
2.	Modificar Datos de Otros Administradores:
a.	Un administrador debe poder modificar los datos de otros administradores.
3.	Bloqueo de Cuenta por Intentos Fallidos:
a.	Si un usuario falla en su inicio de sesión 3 veces consecutivas, se debe bloquear la cuenta por 2 horas.
4.	Cerrar Sesión:
a.	Un usuario debe poder cerrar sesión.
5.	Crear Cuentas de Clientes:
a.	Un usuario debe poder crear cuentas para clientes.
6.	Modificar Cuentas de Clientes:
a.	Un usuario debe poder modificar cuentas de clientes.
7.	Listar Clientes:
a.	Un usuario debe poder ver un listado de clientes.
8.	Crear Productos:
a.	Un usuario debe poder crear productos.
9.	Modificar Productos:
a.	Un usuario debe poder modificar productos.
10.	Listar Productos:
a.	Un usuario debe poder listar productos.
11.	Crear Cotizaciones:
a.	Las cotizaciones deben tener una numeración automática pero modificable.
b.	Las cotizaciones deben contener productos, cada uno con cantidad, detalle y precio.
c.	Las cotizaciones deben estar asociadas a una cuenta y a un usuario.
d.	Las cotizaciones deben tener un precio de envío.
e.	Una cotización puede tener un descuento (opción de porcentual o monto fijo).
f.	Las cotizaciones deben tener un subtotal y un total (antes y después de envío).
12.	Modificar Cotizaciones:
a.	Un usuario debe poder modificar una cotización.
13.	Enviar Cotizaciones por Correo Electrónico:
a.	Se debe poder enviar cada cotización al correo electrónico del cliente asociado (en formato HTML dentro del cuerpo del correo).
14.	Gráfica de Valores Cotizados:
a.	En el escritorio (pantalla inicial después de iniciar sesión), se debe mostrar una gráfica totalizando los valores cotizados por cada uno de los días de la última semana.
15.	Inicio de Sesión:
a.	La plataforma debe permitir el inicio de sesión de los miembros mediante un usuario y una contraseña.
16.	Tipos de Usuario:
a.	Existirán dos tipos de usuario:
i.	Administrador: Tiene todas las capacidades en la plataforma.
ii.	Gestor: Tiene todas las capacidades de la plataforma excepto la creación de usuarios y el cambio de información de los usuarios.
17.	Cambiar Contraseña Propia:
a.	Un usuario debe poder cambiar su propia contraseña.
18.	Creación de Usuarios por Administrador:
a.	Un administrador debe poder crear usuarios.
19.	Asignar Rol a Otro Usuario:
a.	Un administrador debe poder asignar un rol a otro usuario.
20.	Gestión de Permisos:
a.	Implementar un sistema de gestión de permisos que se ajuste a los roles de administrador y gestor.
21.	Restricciones para Usuarios Gestores:
a.	Los usuarios gestores no deben tener la capacidad de crear usuarios ni de cambiar la información de otros usuarios.
22.	Registro de Actividades de Usuario:
a.	Mantener un registro de las actividades realizadas por los usuarios, incluyendo cambios de contraseña, creación de usuarios y asignación de roles.
23.	Recuperación de Contraseña:
a.	Implementar un mecanismo seguro para que los usuarios puedan recuperar su contraseña en caso de olvido.
24.	Políticas de Contraseña:
a.	Establecer políticas de contraseña seguras, como requisitos de longitud, caracteres especiales, etc.
25.	Gestión de Sesiones:
a.	Implementar medidas de seguridad para gestionar las sesiones de usuario de manera segura.
26.	Notificaciones de Cambios de Rol:
a.	Notificar a los usuarios afectados cuando un administrador cambia su rol.
27.	Registro de Inicios de Sesión:
a.	Mantener un registro de los inicios de sesión, incluyendo información como la hora, la ubicación y el dispositivo utilizado.
28.	Bloqueo de Cuenta por Intentos Fallidos:
a.	Ampliar la funcionalidad para bloquear temporalmente la cuenta en caso de múltiples intentos fallidos de inicio de sesión.

