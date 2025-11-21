function registrarUsuario() {
  // Crear variables
  let nombres = document.getElementById('nombres').value.trim();
  let apellidos = document.getElementById('apellidos').value.trim();
  let correo = document.getElementById('correo').value.trim();
  let clave = document.getElementById('clave').value.trim();
  let confirmarClave = document.getElementById('confirmarClave').value.trim();
  let fechaNacimiento = document.getElementById('fechaNacimiento').value.trim();

  // Confirmar que los campos no estén en blanco
  if (nombres === "" || apellidos === "" || correo === "" || clave === "" || confirmarClave === "" || fechaNacimiento === "") {
    alert("⚠️ Por favor llene todos los campos");
    return;
  }

  // Validar coincidencia de claves
  if (clave !== confirmarClave) {
    alert("❌ Las claves no coinciden");
    document.getElementById('clave').style.borderColor = "red";
    document.getElementById('confirmarClave').style.borderColor = "red";
    return;
  }

  // Validar longitud mínima de clave
  if (clave.length < 8) {
    alert("🔒 La clave debe tener mínimo 8 caracteres");
    document.getElementById('clave').style.borderColor = "red";
    return;
  }

  // Validar que el usuario no este registrado
  if (localStorage.getItem('usuario_' + correo)){
    alert('El correo ya esta registrado');
    return;
  }

  // se crea el objeto para guardarlo en localstorage
  let usuario = {
    nombres:nombres,
    apellidos:apellidos,
    correo:correo,
    clave:clave,
    fechaNacimiento:fechaNacimiento,
  };

  //Guardar los datos en localstorage
  localStorage.setItem('usuario_' + correo, JSON.stringify(usuario));
  alert('Registro Exitoso');
  window.location.href = 'index.html';
}

function iniciarSesion() {
  let correo = document.getElementById('correo').value.trim();
  let clave = document.getElementById('clave').value.trim();

  // Recuperar datos del localStorage
  let datos = localStorage.getItem('usuario_' + correo);

  if (!datos) {
    alert('❌ Usuario no encontrado');
    return;
  }

  let usuario = JSON.parse(datos);
  if (usuario.clave !== clave) {
    alert('🔒 Clave incorrecta');
    return;
  }

  // Guardar usuario activo
  localStorage.setItem('usuarioActivo', correo);
  alert('✅ Inicio de sesión exitoso');
  window.location.href = 'inicio.html';
}

function mostrarBienvenida() {
    let correoActivo = localStorage.getItem('usuarioActivo');
    // Si no hay usuario activo, redirigir a la página de inicio de sesión
    if (!correoActivo) {
        window.location.href = 'index.html';
        return;
    }

    let datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
    // Obtener los datos del usuario activo
    if (!datos) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('mensajeBienvenida').innerHTML = 
        `Bienvenido/a, <a href='perfil.html'>${datos.nombres}</a>`;

    mostrarTareas(); // Mostrar tareas al cargar
}

function cerrarSesion(){
  localStorage.removeItem('usuarioActivo'); //Eliminar el usuario activo del almacenamiento local
  const confirmar = confirm("¿Deseas salir del sitio?");

  if(confirmar) {
    alert(" Gracias por visitar la pagina. ¡Hasta pronto!");

    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 500)

  } else {
    alert(" Que bueno que decidiste quedarte.")
  }
}

let indiceTareaEditando = null;

function guardarTarea() {
  const tarea = document.getElementById('nuevaTarea').value.trim();
  if (!tarea) {
    alert('Por favor, ingresa una tarea válida.');
    return;
  }

  const correo = localStorage.getItem('usuarioActivo');
  const tareas = JSON.parse(localStorage.getItem('tareas_' + correo)) || [];
  tareas.push(tarea);
  localStorage.setItem('tareas_' + correo, JSON.stringify(tareas));

  document.getElementById('nuevaTarea').value = '';
  alert('Tarea guardada correctamente');
  mostrarTareas();
}

function mostrarTareas() {
  const correo = localStorage.getItem('usuarioActivo');
  const tareas = JSON.parse(localStorage.getItem('tareas_' + correo)) || [];
  const lista = document.getElementById('listaTareas');
  lista.innerHTML = '';

  tareas.forEach((tarea, i) => {
    lista.innerHTML += `
      <tr>
        <td>${tarea}</td>
        <td><button onclick="irAEditar(${i})">Editar</button></td>
        <td><button onclick="eliminarTarea(${i})">Eliminar</button></td>
      </tr>`;
  });
}

function eliminarTarea(indice) {
  if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
    const correo = localStorage.getItem('usuarioActivo');
    const tareas = JSON.parse(localStorage.getItem('tareas_' + correo)) || [];
    tareas.splice(indice, 1);
    localStorage.setItem('tareas_' + correo, JSON.stringify(tareas));
    alert("Tarea eliminada correctamente");
    mostrarTareas();
  }
}

function irAEditar(indice) {
  const correo = localStorage.getItem('usuarioActivo');
  const tareas = JSON.parse(localStorage.getItem('tareas_' + correo)) || [];
  document.getElementById('tareaEditada').value = tareas[indice];
  indiceTareaEditando = indice;
  document.getElementById('editarModal').style.display = 'block';
}

function guardarEdicion() {
  if (indiceTareaEditando === null) return;

  const nuevaTarea = document.getElementById('tareaEditada').value.trim();
  if (!nuevaTarea) {
    alert('La tarea no puede estar vacía');
    return;
  }

  const correo = localStorage.getItem('usuarioActivo');
  const tareas = JSON.parse(localStorage.getItem('tareas_' + correo)) || [];
  tareas[indiceTareaEditando] = nuevaTarea;
  localStorage.setItem('tareas_' + correo, JSON.stringify(tareas));

  cerrarModal();
  mostrarTareas();
}

function cerrarModal() {
  const modal = document.getElementById('editarModal');
  if (modal) modal.style.display = 'none';
  indiceTareaEditando = null;
}

document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.querySelector('.close');
  if (closeBtn) closeBtn.addEventListener('click', cerrarModal);
});

window.addEventListener('click', function(event) {
  const modal = document.getElementById('editarModal');
  if (event.target === modal) cerrarModal();
});

function irAlPerfil() {
  const correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    alert('No hay sesión activa. Inicia sesión primero.');
    window.location.href = 'index.html';
    return;
  }

  // Redirigir al perfil
  window.location.href = 'perfil.html'; 
}


function cargarDatosUsuario() {
  const correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    window.location.href = 'index.html';
    return;
  }

  const datos = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!datos) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('nombres').value = datos.nombres;
  document.getElementById('apellidos').value = datos.apellidos;
  document.getElementById('correo').value = datos.correo;
  document.getElementById('fechaNacimiento').value = datos.fechaNacimiento;
}

function actualizarPerfil() {
  const correoActivo = localStorage.getItem('usuarioActivo');
  if (!correoActivo) {
    alert("No hay sesión activa");
    window.location.href = "index.html";
    return;
  }

  // Recuperar datos actuales
  let usuario = JSON.parse(localStorage.getItem('usuario_' + correoActivo));
  if (!usuario) {
    alert("Usuario no encontrado");
    return;
  }

  // Obtener valores del formulario
  const nombres = document.getElementById('nombres').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const fechaNacimiento = document.getElementById('fechaNacimiento').value;
  const claveActual = document.getElementById('claveActual').value.trim();
  const claveNueva = document.getElementById('claveNueva').value.trim();
  const confirmarClaveNueva = document.getElementById('confirmarClaveNueva').value.trim();

  // Validar clave actual
  if (claveActual !== usuario.clave) {
    alert("❌ La clave actual es incorrecta");
    return;
  }

  // Validar nueva clave si se quiere cambiar
  if (claveNueva) {
    if (claveNueva !== confirmarClaveNueva) {
      alert("❌ Las nuevas claves no coinciden");
      return;
    }
    if (claveNueva.length < 8) {
      alert("🔒 La nueva clave debe tener mínimo 8 caracteres");
      return;
    }
    usuario.clave = claveNueva; // actualizar clave
  }

  // Actualizar otros datos
  usuario.nombres = nombres;
  usuario.apellidos = apellidos;
  usuario.correo = correo;
  usuario.fechaNacimiento = fechaNacimiento;

  // Guardar en localStorage
  localStorage.setItem('usuario_' + correoActivo, JSON.stringify(usuario));

  alert("✅ Perfil actualizado correctamente");
}

