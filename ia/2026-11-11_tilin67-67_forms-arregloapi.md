Diagnóstico del inicio de sesión con mocks y validación descriptiva por campo en los formularios
- Fecha: 2026-11-11
- Integrante: Moises Collarte (@tilin67-67)
- Herramienta y modelo: ChatGPT (GPT-6)
- Enlace a la conversación: (no disponible)
- Archivos revisados: htmls/Se.html, htmls/Cre.html, js/api.js y mocks/usuarios.json.
- Archivos para los que se propuso código: htmls/Se.html y htmls/Cre.html.
## Objetivo

Primero se buscó identificar por qué las cuentas definidas en los mocks no permitían iniciar sesión. Después se buscó mejorar la validación de los formularios de inicio de sesión y registro, que hasta ese momento utilizaban principalmente atributos HTML como required, type="email" y minlength, incorporando mensajes descriptivos e independientes para cada campo.

## Conversación (texto completo, sin editar)

### Prompt 1

por alguna razon no puedo iniciar sesion con las cuentas de mis mocks, que esta pasando y como lo soluciono https://github.com/tilin67-67/udp-movie-reviewer/tree/067

### Respuesta 1

Se revisó el flujo entre htmls/Se.html, js/api.js y mocks/usuarios.json. La causa identificada fue la posible existencia de datos antiguos en localStorage: la aplicación conserva los usuarios previamente cargados mientras la versión de los mocks no cambie.

#### 1. Causa del problema

En js/api.js se utiliza una versión para controlar la carga inicial de los mocks:
const VERSION_MOCKS = '1';
En el historial de GitHub se encontró que el 11 de noviembre se cambiaron las contraseñas de Anton Ego y Usuario Normal de 12345 a 12345678, pero no se aumentó la versión de los mocks. Por eso, el navegador podía seguir utilizando los usuarios antiguos guardados localmente.

El cambio se puede consultar en el commit Arreglo de Errores Menu/Cierre Sesion.

#### 2. Solución inmediata

Se indicó ejecutar lo siguiente en la consola del navegador:
localStorage.removeItem('usuarios');
localStorage.removeItem('usuario_activo');
location.reload();
Al recargar, la aplicación detecta que no existe la lista usuarios y vuelve a cargar mocks/usuarios.json. Esta operación también elimina las cuentas registradas localmente, pero no las películas ni las reseñas.

#### 3. Prevención para futuras modificaciones

Se propuso separar la versión de los usuarios de la versión general de los mocks:
const VERSION_USUARIOS = '2';
Y dentro de cargarDatosIniciales():
if (localStorage.getItem('usuarios_version') !== VERSION_USUARIOS) {
  localStorage.removeItem('usuarios');
  localStorage.setItem('usuarios_version', VERSION_USUARIOS);
}
Así, al modificar usuarios.json, se podría aumentar solamente VERSION_USUARIOS, evitando reiniciar películas y reseñas. Al cambiar esta versión también se eliminan las cuentas registradas localmente.

#### 4. Comprobaciones adicionales

Se indicó ejecutar el proyecto con npm run dev y abrirlo desde la dirección local de Vite, no mediante doble clic sobre el HTML, porque los mocks se cargan con fetch().

El usuario confirmó posteriormente que logró solucionar el inicio de sesión.

### Prompt 2

gracias ya lo arregle, ahora necesito ayuda para los formularios, hice validacion solo por html con el minlenght y required, necesito hacer mensajes de error por campo con texto descriptivo, guiame, explicame el codigo, la solucion, etc

### Respuesta 2

Se propuso mantener las restricciones HTML existentes y utilizar Alpine.js para controlar los mensajes descriptivos. La idea consiste en consultar validity en cada input, guardar un mensaje independiente por campo y mostrarlo debajo del elemento correspondiente.

#### 1. Entender la validación HTML
- required: obliga a completar el campo.
- type="email": comprueba que el contenido tenga formato de correo válido.
- minlength="8": exige un mínimo de ocho caracteres.
#### 2. Consultar los errores mediante validity
const campo = document.getElementById('mail');

console.log(campo.validity.valueMissing);
console.log(campo.validity.typeMismatch);
console.log(campo.validity.tooShort);
console.log(campo.validity.valid);
- valueMissing: el campo obligatorio está vacío.
- typeMismatch: el contenido no cumple el formato indicado por el tipo del input.
- tooShort: el texto no alcanza la longitud mínima.
- valid: el campo cumple las restricciones.
Esto permite reutilizar las reglas declaradas en HTML sin duplicarlas en JavaScript.

#### 3. Controlar los mensajes con novalidate

Se propuso agregar novalidate al formulario:
<form novalidate @submit.prevent="iniciarSesion()">
novalidate evita que el navegador muestre sus mensajes automáticos al enviar el formulario, pero no elimina las restricciones HTML. Estas siguen disponibles mediante input.validity.

#### 4. Implementación propuesta para Se.html

Se propuso agregar x-ref, los eventos @blur y @input, y un párrafo para mostrar el error de cada campo:
<input
  type="email"
  id="mail"
  x-ref="mail"
  x-model="mail"
  required
  @blur="validarCampo('mail')"
  @input="corregirCampo('mail')"
  :aria-invalid="errores.mail !== ''"
  aria-describedby="mail-error"
>

<p
  id="mail-error"
  x-show="errores.mail"
  x-text="errores.mail"
  role="alert"
></p>
Para la contraseña se utiliza el mismo patrón, con x-ref="clave", minlength="8" y su propio mensaje.

El controlador propuesto fue:
window.loginForm = function() {
  return {
    mail: '',
    clave: '',
    error: null,
    cargando: false,
    errores: {
      mail: '',
      clave: ''
    },

    validarCampo(campo) {
      const input = this.$refs[campo];
      const estado = input.validity;
      let mensaje = '';

      if (estado.valueMissing) {
        mensaje = campo === 'mail'
          ? 'Ingresa tu correo electrónico.'
          : 'Ingresa tu contraseña.';
      } else if (estado.typeMismatch) {
        mensaje = 'Ingresa un correo electrónico válido.';
      } else if (estado.tooShort) {
        mensaje = 'La contraseña debe tener al menos ' +
                  input.minLength + ' caracteres.';
      } else if (!estado.valid) {
        mensaje = 'Revisa el valor ingresado.';
      }

      this.errores[campo] = mensaje;
      return mensaje === '';
    },

    corregirCampo(campo) {
      if (this.errores[campo]) {
        this.validarCampo(campo);
      }
    },

    async iniciarSesion() {
      this.error = null;

      const correoValido = this.validarCampo('mail');
      const claveValida = this.validarCampo('clave');

      if (!correoValido || !claveValida) return;

      this.cargando = true;

      try {
        const res = await login(this.mail, this.clave);

        if (res.ok) {
          window.location.href = '../index.html';
          return;
        }

        this.error = res.error;
      } catch (error) {
        this.error = 'No se pudo completar el inicio de sesión.';
      } finally {
        this.cargando = false;
      }
    }
  };
};
#### 5. Implementación propuesta para Cre.html

Para el registro se aplicó el mismo principio a nombre, correo y contraseña. Cada input utiliza su propia referencia y mensaje. Por ejemplo:
<input
  type="text"
  id="nombre"
  x-ref="nombre"
  x-model="nombre"
  required
  @blur="validarCampo('nombre')"
  @input="corregirCampo('nombre')"
  :aria-invalid="errores.nombre !== ''"
  aria-describedby="nombre-error"
>

<p
  id="nombre-error"
  x-show="errores.nombre"
  x-text="errores.nombre"
  role="alert"
></p>
El controlador propuesto fue:
window.registroForm = function() {
  return {
    nombre: '',
    correo: '',
    clave: '',
    error: null,
    exito: false,
    cargando: false,
    errores: {
      nombre: '',
      correo: '',
      clave: ''
    },

    validarCampo(campo) {
      const input = this.$refs[campo];
      const estado = input.validity;
      let mensaje = '';

      if (campo === 'nombre' && input.value.trim() === '') {
        mensaje = 'Ingresa tu nombre. No puede contener solamente espacios.';
      } else if (estado.valueMissing) {
        if (campo === 'nombre') {
          mensaje = 'El nombre es obligatorio.';
        } else if (campo === 'correo') {
          mensaje = 'Ingresa tu correo electrónico.';
        } else {
          mensaje = 'Ingresa una contraseña.';
        }
      } else if (estado.typeMismatch) {
        mensaje = 'Ingresa un correo electrónico válido.';
      } else if (estado.tooShort) {
        mensaje = 'La contraseña debe tener al menos ' +
                  input.minLength + ' caracteres.';
      } else if (!estado.valid) {
        mensaje = 'Revisa el valor ingresado.';
      }

      this.errores[campo] = mensaje;
      return mensaje === '';
    },

    corregirCampo(campo) {
      if (this.errores[campo]) {
        this.validarCampo(campo);
      }
    },

    async crearCuenta() {
      this.error = null;

      this.validarCampo('nombre');
      this.validarCampo('correo');
      this.validarCampo('clave');

      if (
        this.errores.nombre ||
        this.errores.correo ||
        this.errores.clave
      ) return;

      this.cargando = true;

      try {
        const res = await registrarUsuario({
          nombre: this.nombre,
          correo: this.correo,
          clave: this.clave
        });

        if (!res.ok) {
          if (res.status === 409) {
            this.errores.correo = res.error;
          } else {
            this.error = res.error;
          }
          return;
        }

        this.exito = true;

        setTimeout(() => {
          window.location.href = 'exito.html';
        }, 1200);
      } catch (error) {
        this.error = 'No se pudo completar el registro.';
      } finally {
        this.cargando = false;
      }
    }
  };
};
Se agregó trim() para detectar nombres compuestos solamente por espacios. Si el correo ya está registrado, api.js devuelve el estado 409 y se propuso mostrar ese mensaje debajo del correo. Los errores generales de conexión se muestran en un mensaje separado.

#### 6. Diferencia entre errores de formulario y errores de la capa de servicios
Situación	Dónde se comprueba	Dónde se muestra
Correo vacío o inválido	HTML y Alpine	Debajo del correo
Contraseña demasiado corta	HTML y Alpine	Debajo de la contraseña
Nombre vacío o con espacios	Comprobación adicional en Alpine	Debajo del nombre
Correo ya registrado	api.js	Debajo del correo
Credenciales incorrectas	api.js	Mensaje general del login
Error de conexión	api.js	Mensaje general


#### 7. Accesibilidad
- aria-invalid: indica si el campo contiene un valor inválido.
- aria-describedby: relaciona el input con el párrafo que contiene su mensaje.
- role="alert": identifica el mensaje como una notificación importante para tecnologías de asistencia.
## Qué se incorporó al proyecto
- Se revisó el flujo de autenticación entre Se.html, js/api.js y mocks/usuarios.json.
- Se identificó que localStorage podía conservar usuarios desactualizados respecto de los mocks.
- Se indicó cómo limpiar los usuarios locales y la sesión para volver a cargar los mocks.
- Se propuso separar la versión de los usuarios para evitar reiniciar los demás mocks cuando cambien las cuentas.
- Se propuso incorporar mensajes descriptivos por campo en htmls/Se.html y htmls/Cre.html, utilizando validity, Alpine.js y las restricciones HTML existentes.
- Se propuso utilizar novalidate para controlar los mensajes sin eliminar las reglas HTML.
- Se propuso diferenciar los errores de validación de los errores devueltos por js/api.js.
- No se propuso modificar js/api.js para implementar los mensajes de validación.
- El código de validación quedó como propuesta: no se debe considerar incorporado ni probado en el repositorio hasta integrarlo y ejecutarlo.
## Verificación

**Cómo lo probé**
- Probe a meter datos invalidos y si me saltaron los errores, ademas probe a iniciar sesion  con las cuentas de los mocks y funciono
**Qué entiendo del código**
- localStorage permite conservar información en el navegador incluso después de recargar la página. Por eso, modificar mocks/usuarios.json no actualiza automáticamente los usuarios que ya fueron guardados localmente.
- VERSION_MOCKS sirve para detectar cambios en los datos simulados y decidir cuándo volver a cargarlos. Si la versión no cambia, la aplicación puede seguir utilizando datos antiguos.
- localStorage.removeItem('usuarios') elimina la lista de usuarios guardada localmente. Al recargar, la aplicación puede volver a obtenerla desde mocks/usuarios.json.
- localStorage.removeItem('usuario_activo') elimina la sesión iniciada en ese navegador.
- Una versión independiente, como VERSION_USUARIOS, permitiría actualizar los usuarios sin borrar también las películas y las reseñas. Al cambiar esa versión se perderían las cuentas registradas localmente, porque también forman parte de la lista de usuarios.
- required indica que un campo debe completarse; type="email" exige un formato de correo válido; minlength="8" establece una longitud mínima de ocho caracteres.
- novalidate impide que el navegador muestre sus mensajes automáticos al enviar el formulario, pero no elimina las reglas HTML ni la información que se puede consultar mediante validity.
- input.validity permite conocer el estado de validación de un campo. valueMissing indica que falta un valor obligatorio, typeMismatch que el formato no corresponde al tipo del input y tooShort que el texto no alcanza la longitud mínima. valid indica si cumple todas las restricciones.
- x-ref permite acceder al elemento HTML desde Alpine.js mediante this.$refs. Por ejemplo, x-ref="mail" se puede consultar con this.$refs.mail.
- @blur ejecuta una función cuando el usuario abandona el campo. Se puede utilizar para mostrar el error después de que el usuario haya intentado completar ese input.
- @input ejecuta una función cuando cambia el contenido del campo. En la propuesta se utiliza para volver a validar el input cuando ya tenía un mensaje de error visible.
- errores es un objeto de Alpine.js que guarda un mensaje independiente para cada campo. Así, el error del correo no se confunde con el de la contraseña o el nombre.
- x-show muestra u oculta el párrafo del error según exista un mensaje, y x-text inserta el texto correspondiente.
- validarCampo(campo) consulta las restricciones HTML del input correspondiente, construye el mensaje descriptivo y lo guarda en errores[campo].
- corregirCampo(campo) vuelve a ejecutar la validación cuando el usuario modifica un campo que ya tenía un error visible.
- return mensaje === '' devuelve true cuando no existe un error y false cuando hay un mensaje. Esto permite detener el envío antes de llamar a login() o registrarUsuario().
- trim() elimina los espacios en blanco al principio y al final de una cadena. Se propuso usarlo para evitar que el nombre esté compuesto solamente por espacios.
- aria-invalid comunica si el input contiene un valor inválido, mientras que aria-describedby relaciona el campo con el párrafo que explica el error. role="alert" identifica el mensaje como una notificación importante para tecnologías de asistencia.
- La validación del formulario y la autenticación cumplen funciones distintas. Primero se comprueba que los campos estén completos y tengan un formato aceptable; después se consulta la capa de servicios para saber si las credenciales son correctas.
- En el registro, el estado 409 indica que el correo ya está registrado. Por eso se propuso mostrar ese mensaje específicamente debajo del campo de correo. Los errores de conexión y otros problemas generales se mantienen en un mensaje separado.