// ===================================================================
// DANCE STUDIO - login.js CORREGIDO
// Sistema de autenticación con roles
// ===================================================================

// 🔧 CONFIGURACIÓN DEL SERVIDOR
const API_URL = 'http://localhost:3002'; // ⚠️ CAMBIAR SEGÚN TU PUERTO

$(document).ready(function() {
    console.log('🔐 Sistema de login iniciado');

    // Verificar si ya hay sesión activa
    verificarSesion();

    // Configurar validación
    $("#formLogin").validate({
        rules: {
            usuario: {
                required: true,
                minlength: 3
            },
            password: {
                required: true,
                minlength: 3
            }
        },
        messages: {
            usuario: {
                required: "Ingresa tu usuario",
                minlength: "Mínimo 3 caracteres"
            },
            password: {
                required: "Ingresa tu contraseña",
                minlength: "Mínimo 3 caracteres"
            }
        },
        errorClass: 'invalid-feedback',
        errorElement: 'div',
        highlight: function(element) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function(element) {
            $(element).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function(form) {
            iniciarSesion();
            return false;
        }
    });
});

// ===================================================================
// VERIFICAR SI YA HAY SESIÓN ACTIVA
// ===================================================================
function verificarSesion() {
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');

    if (usuario && rol) {
        console.log('✅ Sesión activa detectada:', usuario, rol);
        redirigirPorRol(rol);
    }
}

// ===================================================================
// INICIAR SESIÓN - VERSIÓN CORREGIDA
// ===================================================================
async function iniciarSesion() {
    const usuario = $('#usuarioLogin').val().trim();
    const password = $('#passwordLogin').val().trim();

    if (!usuario || !password) {
        mostrarAlerta('Por favor completa todos los campos', 'warning');
        return;
    }

    console.log('🔑 Intentando login:', usuario);

    const $btnSubmit = $('#formLogin button[type="submit"]');
    const textoOriginal = $btnSubmit.html();

    try {
        // Deshabilitar botón
        $btnSubmit.html('<span class="spinner-border spinner-border-sm"></span> Validando...').prop('disabled', true);

        // 🔧 PETICIÓN CORREGIDA CON URL COMPLETA
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, password })
        });

        const data = await response.json();

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }

        console.log('✅ Login exitoso:', data);

        // Guardar sesión en localStorage
        localStorage.setItem('usuario', data.usuario.nombre_usuario);
        localStorage.setItem('nombre', data.usuario.nombre_completo);
        localStorage.setItem('rol', data.usuario.rol);
        localStorage.setItem('id', data.usuario.id);
        localStorage.setItem('email', data.usuario.email);
        localStorage.setItem('loginTime', new Date().toISOString());

        // Mostrar mensaje de bienvenida
        mostrarAlerta(`¡Bienvenido ${data.usuario.nombre_completo}!`, 'success');

        // Redirigir según el rol después de 1 segundo
        setTimeout(() => {
            redirigirPorRol(data.usuario.rol);
        }, 1000);

    } catch (error) {
        console.error('❌ Error en login:', error);

        // Mostrar error específico
        const mensaje = error.message || 'Error al conectar con el servidor';
        mostrarAlerta(mensaje, 'danger');

        // Restaurar botón
        $btnSubmit.html(textoOriginal).prop('disabled', false);

        // Limpiar contraseña
        $('#passwordLogin').val('').focus();
    }
}

// ===================================================================
// REDIRIGIR SEGÚN EL ROL
// ===================================================================
function redirigirPorRol(rol) {
    console.log('🔀 Redirigiendo rol:', rol);

    switch (rol) {
        case 'admin':
            window.location.href = 'index.html';
            break;
        case 'maestro':
            window.location.href = 'index.html';
            break;
        case 'usuario':
            window.location.href = 'index.html#inscripcion';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// ===================================================================
// MOSTRAR ALERTAS
// ===================================================================
function mostrarAlerta(mensaje, tipo) {
    const iconos = {
        success: 'check-circle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };

    const titulos = {
        success: '¡Éxito!',
        danger: '¡Error!',
        warning: '¡Atención!',
        info: 'Información'
    };

    const alertaHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show animate__animated animate__fadeInDown" 
             role="alert" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 350px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
            <i class="bi bi-${iconos[tipo]}"></i>
            <strong>${titulos[tipo]}</strong>
            <p class="mb-0 mt-1">${mensaje}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    $('body').append(alertaHTML);

    setTimeout(() => {
        $('.alert').fadeOut(500, function() {
            $(this).remove();
        });
    }, 4000);
}

// ===================================================================
// FUNCIÓN DE PRUEBA DE CONEXIÓN
// ===================================================================
async function probarConexion() {
    try {
        const response = await fetch(`${API_URL}/api/test`);
        const data = await response.json();
        console.log('✅ Conexión con servidor:', data);
        return true;
    } catch (error) {
        console.error('❌ No se puede conectar con el servidor:', error);
        mostrarAlerta('No se puede conectar con el servidor. Verifica que esté corriendo en el puerto 3001', 'danger');
        return false;
    }
}

// Probar conexión al cargar
$(document).ready(function() {
    probarConexion();
});

console.log('✅ Sistema de login configurado');