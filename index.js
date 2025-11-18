// ===================================================================
// DANCE STUDIO - index.js CORREGIDO
// ===================================================================

// ===================================================================
// DANCE STUDIO - INDEX.JS CORREGIDO (Sin errores de sintaxis)
// ===================================================================

$(document).ready(function() {
    console.log('🎵 Dance Studio - Sistema iniciado');

    // Cargar contenido de la BD
    cargarClases();
    cargarMaestros();
    cargarHorarios();
    cargarInscripciones();

    // Configurar validación
    configurarValidacion();

    // Smooth scroll
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
});

// ===================================================================
// VALIDACIÓN DEL FORMULARIO DE INSCRIPCIÓN
// ===================================================================
function configurarValidacion() {
    $("#formInscripcion").validate({
        rules: {
            nombreAlumno: {
                required: true,
                minlength: 3
            },
            claseSeleccionada: {
                required: true
            }
        },
        messages: {
            nombreAlumno: {
                required: "Ingresa tu nombre completo",
                minlength: "Mínimo 3 caracteres"
            },
            claseSeleccionada: {
                required: "Selecciona una clase"
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
            enviarInscripcion();
            return false;
        }
    });
}

// ===================================================================
// CARGAR CLASES
// ===================================================================
async function cargarClases() {
    try {
        const response = await $.ajax({
            url: '/api/clases',
            method: 'GET',
            dataType: 'json'
        });

        mostrarClases(response);
        llenarSelectClases(response);
        console.log('✅ Clases cargadas:', response.length);

    } catch (error) {
        console.error('❌ Error al cargar clases:', error);
        $('#listaClases').html(`
            <div class="col-12">
                <div class="alert alert-danger">
                    Error al cargar las clases. Verifica que el servidor esté corriendo.
                </div>
            </div>
        `);
    }
}

function mostrarClases(clases) {
    if (clases.length === 0) {
        $('#listaClases').html('<div class="col-12 text-center"><p class="text-muted">No hay clases disponibles</p></div>');
        return;
    }

    let html = '';
    clases.forEach((clase, index) => {
        const delay = index * 100;
        html += `
            <div class="col-md-4 mb-4 animate__animated animate__fadeIn" style="animation-delay: ${delay}ms">
                <div class="card h-100 shadow-sm">
                    <img src="${clase.imagen_url || 'https://via.placeholder.com/400x250'}" 
                         class="card-img-top" alt="${clase.nombre}">
                    <div class="card-body">
                        <h5 class="card-title text-primary">
                            <i class="bi bi-music-note-beamed"></i> ${clase.nombre}
                        </h5>
                        <p class="card-text">${clase.descripcion || 'Clase de danza profesional'}</p>
                        <p class="mb-1"><strong>Nivel:</strong> ${clase.nivel || 'Todos'}</p>
                        <p class="mb-1"><strong>Duración:</strong> ${clase.duracion_minutos} min</p>
                        <p class="mb-1"><strong>Precio:</strong> <span class="text-success">$${parseFloat(clase.precio_clase || 0).toFixed(2)}</span></p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <a href="#inscripcion" class="btn btn-primary btn-sm w-100">
                            <i class="bi bi-pencil-square"></i> Inscribirse
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    $('#listaClases').html(html);
}

function llenarSelectClases(clases) {
    const $select = $('#claseSeleccionada');
    $select.empty();
    $select.append('<option value="" selected disabled>Selecciona una clase...</option>');

    clases.forEach(clase => {
        $select.append(`<option value="${clase.nombre}">${clase.nombre} - $${parseFloat(clase.precio_clase || 0).toFixed(2)}</option>`);
    });
}

// ===================================================================
// CARGAR MAESTROS
// ===================================================================
async function cargarMaestros() {
    try {
        const response = await $.ajax({
            url: '/api/maestros',
            method: 'GET',
            dataType: 'json'
        });

        mostrarMaestros(response);
        console.log('✅ Maestros cargados:', response.length);

    } catch (error) {
        console.error('❌ Error al cargar maestros:', error);
        $('#listaMaestros').html(`
            <div class="col-12">
                <div class="alert alert-danger">Error al cargar maestros</div>
            </div>
        `);
    }
}

function mostrarMaestros(maestros) {
    if (maestros.length === 0) {
        $('#listaMaestros').html('<div class="col-12 text-center"><p class="text-muted">No hay maestros disponibles</p></div>');
        return;
    }

    let html = '';
    maestros.forEach((maestro, index) => {
        const delay = index * 100;
        html += `
            <div class="col-md-3 mb-4 animate__animated animate__fadeIn" style="animation-delay: ${delay}ms">
                <div class="card h-100 shadow-sm text-center">
                    <img src="${maestro.foto_url || 'https://via.placeholder.com/300'}" 
                         class="card-img-top rounded-circle mx-auto mt-3" 
                         style="width: 150px; height: 150px; object-fit: cover;" 
                         alt="${maestro.nombre_completo}">
                    <div class="card-body">
                        <h5 class="card-title">${maestro.nombre_completo}</h5>
                        <p class="card-text"><span class="badge bg-primary">${maestro.especialidad}</span></p>
                        <p class="small text-muted">${maestro.biografia || 'Maestro profesional de danza'}</p>
                        <p class="small">
                            <i class="bi bi-envelope"></i> ${maestro.email}<br>
                            <i class="bi bi-telephone"></i> ${maestro.telefono}
                        </p>
                    </div>
                </div>
            </div>
        `;
    });
    $('#listaMaestros').html(html);
}

// ===================================================================
// CARGAR HORARIOS
// ===================================================================
async function cargarHorarios() {
    try {
        const response = await $.ajax({
            url: '/api/horarios',
            method: 'GET',
            dataType: 'json'
        });

        mostrarHorarios(response);
        console.log('✅ Horarios cargados:', response.length);

    } catch (error) {
        console.error('❌ Error al cargar horarios:', error);
        $('#tablaHorarios').html(`
            <tr><td colspan="5" class="text-center text-danger">Error al cargar horarios</td></tr>
        `);
    }
}

function mostrarHorarios(horarios) {
    if (horarios.length === 0) {
        $('#tablaHorarios').html('<tr><td colspan="5" class="text-center text-muted">No hay horarios disponibles</td></tr>');
        return;
    }

    let html = '';
    horarios.forEach(horario => {
        html += `
            <tr class="animate__animated animate__fadeIn">
                <td><strong>${horario.dia_semana}</strong></td>
                <td>${horario.hora_inicio} - ${horario.hora_fin}</td>
                <td><span class="badge bg-primary">${horario.clase_nombre || 'N/A'}</span></td>
                <td>${horario.maestro_nombre || 'Por asignar'}</td>
                <td>${horario.salon || 'Por definir'}</td>
            </tr>
        `;
    });
    $('#tablaHorarios').html(html);
}

// ===================================================================
// 🔧 CORREGIDO: CARGAR INSCRIPCIONES (sin errores de sintaxis)
// ===================================================================
async function cargarInscripciones() {
    try {
        const response = await $.ajax({
            url: '/api/inscripciones',
            method: 'GET',
            dataType: 'json'
        });

        mostrarInscripciones(response);
        console.log('✅ Inscripciones cargadas:', response.length);

    } catch (error) {
        console.error('❌ Error al cargar inscripciones:', error);
        $('#tablainscripciones').html(`
            <tr><td colspan="4" class="text-center text-danger">Error al cargar inscripciones</td></tr>
        `);
    }
}

function mostrarInscripciones(inscripciones) {
    if (inscripciones.length === 0) {
        $('#tablainscripciones').html('<tr><td colspan="4" class="text-center text-muted">No hay inscripciones registradas</td></tr>');
        return;
    }

    let html = '';
    inscripciones.slice(0, 10).forEach(inscripcion => {
        const fecha = new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-MX');
        const estadoBadge = inscripcion.estado === 'activa' ? 'success' : 'secondary';

        html += `
            <tr class="animate__animated animate__fadeIn">
                <td>${inscripcion.nombre_alumno}</td>
                <td><span class="badge bg-primary">${inscripcion.clase_nombre}</span></td>
                <td>${fecha}</td>
                <td><span class="badge bg-${estadoBadge}">${inscripcion.estado || 'activa'}</span></td>
            </tr>
        `;
    });
    $('#tablainscripciones').html(html);
}

// ===================================================================
// 🔧 CORREGIDO: ENVIAR INSCRIPCIÓN (sin errores de sintaxis)
// ===================================================================
async function enviarInscripcion() {
    const datos = {
        nombre_alumno: $('#nombreAlumno').val(),
        clase_nombre: $('#claseSeleccionada').val(),
        fecha_inicio: $('#fechaInicio').val() || new Date().toISOString().split('T')[0],
        notas: $('#notasInscripcion').val()
    };

    console.log('📤 Enviando inscripción:', datos);

    try {
        const $btnSubmit = $('#formInscripcion button[type="submit"]');
        const textoOriginal = $btnSubmit.html();
        $btnSubmit.html('<span class="spinner-border spinner-border-sm"></span> Procesando...').prop('disabled', true);

        const response = await $.ajax({
            url: '/api/inscripciones',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datos)
        });

        console.log('✅ Respuesta:', response);
        mostrarAlerta(response.mensaje || '¡Inscripción exitosa!', 'success');

        $('#formInscripcion')[0].reset();
        $('#formInscripcion').removeClass('was-validated');
        $('#formInscripcion .is-valid').removeClass('is-valid');

        cargarInscripciones();

        $('#formInscripcion').addClass('animate__animated animate__bounceIn');
        setTimeout(() => {
            $('#formInscripcion').removeClass('animate__animated animate__bounceIn');
        }, 1000);

        $btnSubmit.html(textoOriginal).prop('disabled', false);

    } catch (error) {
        console.error('❌ Error al enviar inscripción:', error);
        mostrarAlerta(
            error.responseJSON && error.responseJSON.error ?
            error.responseJSON.error :
            'Error al procesar la inscripción',
            'danger'
        );

        $('#formInscripcion button[type="submit"]')
            .html('<i class="bi bi-check-circle"></i> Inscribirme')
            .prop('disabled', false);
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

console.log('✅ Sistema Dance Studio cargado correctamente');