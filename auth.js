// ===================================================================
// DANCE STUDIO - auth.js
// Verificar sesión y permisos
// Incluir este script en TODAS las páginas protegidas
// ===================================================================

(function() {
    'use strict';

    // Verificar si hay sesión activa
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');
    const nombre = localStorage.getItem('nombre');

    // Si no hay sesión, redirigir al login
    if (!usuario || !rol) {
        console.warn('⚠️ No hay sesión activa, redirigiendo al login...');
        window.location.href = 'login.html';
        return;
    }

    console.log(`✅ Sesión activa: ${nombre} (${rol})`);

    // Mostrar información del usuario en la navbar
    $(document).ready(function() {
        // Agregar info del usuario al navbar
        const userInfo = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle"></i> ${nombre}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item disabled"><strong>Rol:</strong> ${rol}</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="cerrarSesion()">
                        <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                    </a></li>
                </ul>
            </li>
        `;

        $('.navbar-nav').append(userInfo);

        // Ocultar opciones según el rol
        aplicarPermisosPorRol(rol);
    });

})();

// ===================================================================
// APLICAR PERMISOS POR ROL
// ===================================================================
function aplicarPermisosPorRol(rol) {
    if (rol === 'usuario') {
        // Los usuarios solo pueden inscribirse
        $('a[href="productos.html"]').parent().hide();
        $('a[href="usuarios.html"]').parent().hide();
        console.log('🔒 Permisos de USUARIO aplicados');
    }

    if (rol === 'maestro') {
        // Los maestros no pueden gestionar usuarios
        $('a[href="usuarios.html"]').parent().hide();
        console.log('🔒 Permisos de MAESTRO aplicados');
    }

    if (rol === 'admin') {
        // Los admin tienen acceso a todo
        console.log('🔓 Permisos de ADMINISTRADOR (acceso completo)');
    }
}

// ===================================================================
// CERRAR SESIÓN
// ===================================================================
function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        // Limpiar localStorage
        localStorage.clear();

        // Mostrar mensaje
        alert('Sesión cerrada correctamente');

        // Redirigir al login
        window.location.href = 'login.html';
    }
}

console.log('🔐 Sistema de autenticación cargado');