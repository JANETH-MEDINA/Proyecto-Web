// ===================================================================
// DANCE STUDIO - USUARIOS.JS CORREGIDO
// ===================================================================

let usuarioEditando = null;

$(document).ready(function() {
    console.log('👥 Módulo de Usuarios iniciado');
    cargarUsuarios();
    configurarValidacion();
    configurarEventos();
});

// ===================================================================
// VALIDACIÓN DEL FORMULARIO
// ===================================================================
function configurarValidacion() {
    $("#formUsuario").validate({
        rules: {
            nombreUsuario: {
                required: true,
                minlength: 4
            },
            nombreCompleto: {
                required: true,
                minlength: 3
            },
            emailUsuario: {
                required: true,
                email: true
            },
            passwordUsuario: {
                minlength: 6
            },
            telefonoUsuario: {
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            rolUsuario: {
                required: true
            }
        },
        messages: {
            nombreUsuario: {
                required: "Ingresa un nombre de usuario",
                minlength: "Mínimo 4 caracteres"
            },
            nombreCompleto: {
                required: "Ingresa el nombre completo",
                minlength: "Mínimo 3 caracteres"
            },
            emailUsuario: {
                required: "Ingresa un correo electrónico",
                email: "Correo inválido"
            },
            passwordUsuario: {
                minlength: "La contraseña debe tener al menos 6 caracteres"
            },
            telefonoUsuario: {
                digits: "Solo números",
                minlength: "Debe tener 10 dígitos",
                maxlength: "Debe tener 10 dígitos"
            },
            rolUsuario: {
                required: "Selecciona un rol"
            }
        }
    });
}

// ===================================================================
// CONFIGURAR EVENTOS
// ===================================================================
function configurarEventos() {
    $('#formUsuario').on('submit', function(e) {
        e.preventDefault();
        if ($(this).valid()) {
            crearUsuario();
        }
    });

    $('#btnActualizarUsuario').on('click', function() {
        if ($('#formUsuario').valid()) {
            actualizarUsuario();
        }
    });

    $('#btnLimpiarUsuario').on('click', limpiarFormulario);

    $('#btnRefrescarUsuarios').on('click', function() {
        $(this).addClass('animate__animated animate__rotateIn');
        cargarUsuarios();
        setTimeout(() => {
            $(this).removeClass('animate__animated animate__rotateIn');
        }, 1000);
    });

    $('#filtroRol').on('change', function() {
        const rol = $(this).val();
        cargarUsuarios(rol);
    });
}

// ===================================================================
// 🔧 CORREGIDO: CARGAR USUARIOS CON AJAX
// ===================================================================
async function cargarUsuarios(filtroRol = '') {
    try {
        // ✅ CAMBIO: Usar ruta relativa como en productos.js
        const url = filtroRol ?
            `/api/usuarios?rol=${filtroRol}` :
            '/api/usuarios';

        const response = await $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json'
        });

        mostrarUsuarios(response);
        console.log(`✅ ${response.length} usuarios cargados`);

    } catch (error) {
        console.error('❌ Error al cargar usuarios:', error);
        $('#tablaUsuarios').html(`
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="alert alert-danger mb-0">
                        <i class="bi bi-exclamation-triangle"></i> 
                        Error al cargar usuarios. Verifica que el servidor esté corriendo.
                    </div>
                </td>
            </tr>
        `);
    }
}

// ===================================================================
// MOSTRAR USUARIOS EN TABLA
// ===================================================================
function mostrarUsuarios(usuarios) {
    if (usuarios.length === 0) {
        $('#tablaUsuarios').html(`
            <tr>
                <td colspan="7" class="text-center py-5">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #ddd;"></i>
                    <p class="text-muted mt-3">No hay usuarios registrados</p>
                </td>
            </tr>
        `);
        return;
    }

    let html = '';
    usuarios.forEach((usuario, index) => {
        let badgeRol = '';
        switch (usuario.rol) {
            case 'admin':
                badgeRol = '<span class="badge bg-danger">Administrador</span>';
                break;
            case 'maestro':
                badgeRol = '<span class="badge bg-warning text-dark">Maestro</span>';
                break;
            case 'usuario':
                badgeRol = '<span class="badge bg-info">Usuario</span>';
                break;
        }

        const fecha = new Date(usuario.fecha_creacion).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const delay = index * 30;

        html += `
            <tr class="animate__animated animate__fadeIn" style="animation-delay: ${delay}ms">
                <td><strong>${usuario.id}</strong></td>
                <td><i class="bi bi-person-circle text-primary"></i> ${usuario.nombre_usuario}</td>
                <td>${usuario.nombre_completo}</td>
                <td><small>${usuario.email}</small></td>
                <td>${badgeRol}</td>
                <td><small>${fecha}</small></td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-warning" onclick="editarUsuario(${usuario.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger" onclick="eliminarUsuario(${usuario.id}, '${usuario.nombre_usuario}')" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    $('#tablaUsuarios').html(html);
}

// ===================================================================
// 🔧 CORREGIDO: CREAR USUARIO
// ===================================================================
async function crearUsuario() {
    const password = $('#passwordUsuario').val();
    if (!password || password.length < 6) {
        mostrarAlerta('La contraseña es requerida y debe tener al menos 6 caracteres', 'warning');
        return;
    }

    // ✅ CAMBIO: Estructura simplificada como productos.js
    const usuario = {
        nombre_usuario: $('#nombreUsuario').val().trim(),
        email: $('#emailUsuario').val().trim(),
        password: password,
        nombre_completo: $('#nombreCompleto').val().trim(),
        rol: $('#rolUsuario').val(),
        telefono: $('#telefonoUsuario').val().trim() || null
    };

    console.log('💾 Creando usuario:', usuario);

    try {
        const $btnSubmit = $('#formUsuario button[type="submit"]');
        const textoOriginal = $btnSubmit.html();
        $btnSubmit.html('<span class="spinner-border spinner-border-sm"></span> Creando...').prop('disabled', true);

        // ✅ CAMBIO: Usar ruta relativa
        const response = await $.ajax({
            url: '/api/usuarios',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(usuario)
        });

        console.log('✅ Usuario creado:', response);
        mostrarAlerta(response.mensaje || 'Usuario creado exitosamente', 'success');
        limpiarFormulario();
        cargarUsuarios();

        $btnSubmit.html(textoOriginal).prop('disabled', false);

    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        const mensajeError = error.responseJSON && error.responseJSON.error ?
            error.responseJSON.error :
            'Error al crear el usuario';

        mostrarAlerta(mensajeError, 'danger');

        $('#formUsuario button[type="submit"]')
            .html('<i class="bi bi-person-plus"></i> Crear Usuario')
            .prop('disabled', false);
    }
}

// ===================================================================
// 🔧 CORREGIDO: EDITAR USUARIO
// ===================================================================
async function editarUsuario(id) {
    try {
        // ✅ CAMBIO: Usar ruta relativa
        const response = await $.ajax({
            url: `/api/usuarios/${id}`,
            method: 'GET'
        });

        console.log('✏️ Editando usuario:', response);

        usuarioEditando = id;
        $('#usuarioId').val(id);
        $('#nombreUsuario').val(response.nombre_usuario);
        $('#nombreCompleto').val(response.nombre_completo);
        $('#emailUsuario').val(response.email);
        $('#telefonoUsuario').val(response.telefono || '');
        $('#rolUsuario').val(response.rol);
        $('#passwordUsuario').val('');

        $('html, body').animate({
            scrollTop: $('#formUsuario').offset().top - 100
        }, 500);

        mostrarAlerta('Usuario cargado. Modifica los datos y presiona "Actualizar".<br><small>Deja la contraseña en blanco para mantener la actual.</small>', 'info');

        $('#formUsuario').addClass('animate__animated animate__pulse');
        setTimeout(() => {
            $('#formUsuario').removeClass('animate__animated animate__pulse');
        }, 1000);

    } catch (error) {
        console.error('❌ Error al cargar usuario:', error);
        mostrarAlerta('Error al cargar el usuario', 'danger');
    }
}

// ===================================================================
// 🔧 CORREGIDO: ACTUALIZAR USUARIO
// ===================================================================
async function actualizarUsuario() {
    if (!usuarioEditando) {
        mostrarAlerta('Selecciona un usuario para actualizar', 'warning');
        return;
    }

    const usuario = {
        nombre_usuario: $('#nombreUsuario').val().trim(),
        email: $('#emailUsuario').val().trim(),
        nombre_completo: $('#nombreCompleto').val().trim(),
        rol: $('#rolUsuario').val(),
        telefono: $('#telefonoUsuario').val().trim() || null
    };

    const password = $('#passwordUsuario').val();
    if (password && password.length >= 6) {
        usuario.password = password;
    }

    console.log('📝 Actualizando usuario:', usuario);

    try {
        const $btnActualizar = $('#btnActualizarUsuario');
        const textoOriginal = $btnActualizar.html();
        $btnActualizar.html('<span class="spinner-border spinner-border-sm"></span> Actualizando...').prop('disabled', true);

        // ✅ CAMBIO: Usar ruta relativa
        const response = await $.ajax({
            url: `/api/usuarios/${usuarioEditando}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(usuario)
        });

        console.log('✅ Usuario actualizado:', response);
        mostrarAlerta(response.mensaje || 'Usuario actualizado exitosamente', 'success');
        limpiarFormulario();
        cargarUsuarios();

        $btnActualizar.html(textoOriginal).prop('disabled', false);

    } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        const mensajeError = error.responseJSON && error.responseJSON.error ?
            error.responseJSON.error :
            'Error al actualizar el usuario';

        mostrarAlerta(mensajeError, 'danger');

        $('#btnActualizarUsuario')
            .html('<i class="bi bi-pencil"></i> Actualizar')
            .prop('disabled', false);
    }
}

// ===================================================================
// 🔧 CORREGIDO: ELIMINAR USUARIO
// ===================================================================
async function eliminarUsuario(id, nombreUsuario) {
    if (!await confirmarAccion(
            `¿Eliminar al usuario "${nombreUsuario}"?`,
            'Esta acción no se puede deshacer y se perderá toda su información.'
        )) {
        return;
    }

    try {
        // ✅ CAMBIO: Usar ruta relativa
        const response = await $.ajax({
            url: `/api/usuarios/${id}`,
            method: 'DELETE',
            contentType: 'application/json'
        });

        console.log('🗑️ Usuario eliminado:', response);
        mostrarAlerta(response.mensaje || 'Usuario eliminado exitosamente', 'success');
        cargarUsuarios();

    } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        const mensajeError = error.responseJSON && error.responseJSON.error ?
            error.responseJSON.error :
            'Error al eliminar el usuario';
        mostrarAlerta(mensajeError, 'danger');

    }
}

// ===================================================================
// LIMPIAR FORMULARIO
// ===================================================================
function limpiarFormulario() {
    usuarioEditando = null;
    $('#usuarioId').val('');
    $('#formUsuario')[0].reset();
    $('#formUsuario').validate().resetForm();
    $('#formUsuario .is-valid, #formUsuario .is-invalid').removeClass('is-valid is-invalid');

    $('#formUsuario').addClass('animate__animated animate__fadeIn');
    setTimeout(() => {
        $('#formUsuario').removeClass('animate__animated animate__fadeIn');
    }, 500);
}

// ===================================================================
// MOSTRAR ALERTAS (igual que productos.js)
// ===================================================================
function mostrarAlerta(mensaje, tipo) {
    const iconos = {
        success: 'check-circle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };

    const alertaHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show animate__animated animate__fadeInDown" 
             role="alert" 
             style="position: fixed; top: 100px; right: 20px; z-index: 9999; min-width: 350px; max-width: 500px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
            <i class="bi bi-${iconos[tipo]}"></i>
            <strong>${tipo === 'success' ? '¡Éxito!' : tipo === 'danger' ? '¡Error!' : tipo === 'warning' ? '¡Atención!' : 'Información'}</strong>
            <p class="mb-0 mt-1">${mensaje}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    $('body').append(alertaHTML);

    setTimeout(() => {
        $('.alert').fadeOut(500, function() {
            $(this).remove();
        });
    }, 5000);
}

// ===================================================================
// CONFIRMAR ACCIONES (igual que productos.js)
// ===================================================================
function confirmarAccion(titulo, mensaje) {
    return new Promise((resolve) => {
        const modalHTML = `
            <div class="modal fade" id="confirmarModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" style="border-radius: 15px;">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-exclamation-triangle"></i> ${titulo}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p class="mb-0">${mensaje}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger" id="btnConfirmar">
                                <i class="bi bi-trash"></i> Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('confirmarModal'));
        modal.show();

        $('#btnConfirmar').on('click', function() {
            modal.hide();
            resolve(true);
            $('#confirmarModal').on('hidden.bs.modal', function() {
                $(this).remove();
            });
        });

        $('#confirmarModal').on('hidden.bs.modal', function() {
            resolve(false);
            $(this).remove();
        });
    });
}

console.log('✅ Módulo de Usuarios configurado correctamente');