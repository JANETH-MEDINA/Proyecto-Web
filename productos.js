let productoEditando = null;

// jQuery Document Ready
$(document).ready(function() {
    console.log('🛍️ Módulo de Productos iniciado');

    // Cargar productos al iniciar
    cargarProductos();

    // Configurar validación
    configurarValidacion();

    //Configurar eventos
    configurarEventos();
});

// ===================================================================
// VALIDACIÓN DEL FORMULARIO
// ===================================================================
function configurarValidacion() {
    $("#formProducto").validate({
        rules: {
            nombreProducto: {
                required: true,
                minlength: 3
            },
            tipoProducto: {
                required: true
            },
            descripcionProducto: {
                required: true,
                minlength: 10
            },
            precioProducto: {
                required: true,
                min: 0
            }
        },
        messages: {
            nombreProducto: {
                required: "Ingresa el nombre del producto/servicio",
                minlength: "Mínimo 3 caracteres"
            },
            tipoProducto: {
                required: "Selecciona el tipo"
            },
            descripcionProducto: {
                required: "Ingresa una descripción",
                minlength: "La descripción debe tener al menos 10 caracteres"
            },
            precioProducto: {
                required: "Ingresa el precio",
                min: "El precio debe ser mayor a 0"
            }
        }
    });
}

// ===================================================================
// CONFIGURAR EVENTOS DINÁMICOS
// ===================================================================
function configurarEventos() {
    // Evento submit del formulario
    $('#formProducto').on('submit', function(e) {
        e.preventDefault();
        if ($(this).valid()) {
            guardarProducto();
        }
    });

    // Botón actualizar
    $('#btnActualizarProducto').on('click', function() {
        if ($('#formProducto').valid()) {
            actualizarProducto();
        }
    });

    // Botón limpiar
    $('#btnLimpiarProducto').on('click', limpiarFormulario);

    // Botón refrescar
    $('#btnRefrescarProductos').on('click', function() {
        $(this).addClass('animate__animated animate__rotateIn');
        cargarProductos();
        setTimeout(() => {
            $(this).removeClass('animate__animated animate__rotateIn');
        }, 1000);
    });

    // Filtro por tipo
    $('#filtroTipo').on('change', function() {
        const tipo = $(this).val();
        cargarProductos(tipo);
    });
}

// ===================================================================
// CARGAR PRODUCTOS CON AJAX
// ===================================================================
async function cargarProductos(filtro = '') {
    try {
        const url = filtro ? `/api/productos?tipo=${filtro}` : '/api/productos';

        const response = await $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json'
        });

        mostrarProductos(response);
        console.log(`✅ ${response.length} productos cargados`);

    } catch (error) {
        console.error('Error al cargar productos:', error);
        $('#listaProductos').html(`
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Error al cargar productos. Intenta de nuevo.
                </div>
            </div>
        `);
    }
}

// ===================================================================
// MOSTRAR PRODUCTOS EN CARDS
// ===================================================================
function mostrarProductos(productos) {
    if (productos.length === 0) {
        $('#listaProductos').html(`
            <div class="col-12 text-center py-5">
                <i class="bi bi-inbox" style="font-size: 4rem; color: #ddd;"></i>
                <p class="text-muted mt-3">No hay productos disponibles</p>
            </div>
        `);
        return;
    }

    let html = '';
    productos.forEach((producto, index) => {
                const badge = producto.tipo === 'producto' ?
                    '<span class="badge bg-success">Producto</span>' :
                    '<span class="badge bg-info">Servicio</span>';

                const imagen = producto.imagen_url || 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                const delay = index * 50;

                html += `
            <div class="col-md-4 mb-4 animate__animated animate__fadeIn" style="animation-delay: ${delay}ms">
                <div class="card h-100 shadow-sm producto-card">
                    <img src="${imagen}" class="card-img-top" alt="${producto.nombre}" 
                         style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${producto.nombre} ${badge}
                        </h5>
                        <p class="card-text text-muted small">${producto.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <strong class="text-primary fs-5">$${parseFloat(producto.precio).toFixed(2)}</strong>
                                ${producto.tipo === 'producto' ? `<br><small class="text-muted">Stock: ${producto.stock}</small>` : ''}
                            </div>
                        </div>
                        ${producto.categoria ? `<span class="badge bg-secondary mt-2">${producto.categoria}</span>` : ''}
                    </div>
                    <div class="card-footer bg-transparent">
                        <button class="btn btn-sm btn-warning" onclick="editarProducto(${producto.id})">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id}, '${producto.nombre}')">
                            <i class="bi bi-trash"></i> Eliminar
                       4 </button>
                    </div>
                </div>
            </div>
        `;
    });

    $('#listaProductos').html(html);
}

// ===================================================================
// GUARDAR PRODUCTO
// ===================================================================
async function guardarProducto() {
    const producto = {
        nombre: $('#nombreProducto').val(),
        tipo: $('#tipoProducto').val(),
        descripcion: $('#descripcionProducto').val(),
        precio: parseFloat($('#precioProducto').val()),
        stock: parseInt($('#stockProducto').val()) || 0,
        imagen_url: $('#imagenProducto').val() || null,
        categoria: $('#categoriaProducto').val() || null
    };

    try {
        // Mostrar loading
        const $btnSubmit = $('#formProducto button[type="submit"]');
        const textoOriginal = $btnSubmit.html();
        $btnSubmit.html('<span class="spinner-border spinner-border-sm"></span> Guardando...').prop('disabled', true);

        const response = await $.ajax({
            url: '/api/productos',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(producto)
        });

        mostrarAlerta(response.mensaje || 'Producto guardado exitosamente', 'success');
        limpiarFormulario();
        cargarProductos();
        
        // Restaurar botón
        $btnSubmit.html(textoOriginal).prop('disabled', false);
        
    } catch (error) {
        console.error('Error al guardar producto:', error);
        mostrarAlerta(error.responseJSON?.error || 'Error al guardar el producto', 'danger');
        
        // Restaurar botón
        $('#formProducto button[type="submit"]').html('<i class="bi bi-save"></i> Guardar').prop('disabled', false);
    }
}

// ===================================================================
// EDITAR PRODUCTO
// ===================================================================
async function editarProducto(id) {
    try {
        const response = await $.ajax({
            url: `/api/productos/${id}`,
            method: 'GET'
        });

        productoEditando = id;
        $('#productoId').val(id);
        $('#nombreProducto').val(response.nombre);
        $('#tipoProducto').val(response.tipo);
        $('#descripcionProducto').val(response.descripcion);
        $('#precioProducto').val(response.precio);
        $('#stockProducto').val(response.stock);
        $('#imagenProducto').val(response.imagen_url || '');
        $('#categoriaProducto').val(response.categoria || '');

        // Scroll al formulario
        $('html, body').animate({
            scrollTop: $('#formProducto').offset().top - 100
        }, 500);
        
        mostrarAlerta('Producto cargado. Modifica los datos y presiona "Actualizar"', 'info');
        
        // Highlight del formulario
        $('#formProducto').addClass('animate__animated animate__pulse');
        setTimeout(() => {
            $('#formProducto').removeClass('animate__animated animate__pulse');
        }, 1000);
        
    } catch (error) {
        console.error('Error al cargar producto:', error);
        mostrarAlerta('Error al cargar el producto', 'danger');
    }
}

// ===================================================================
// ACTUALIZAR PRODUCTO
// ===================================================================
async function actualizarProducto() {
    if (!productoEditando) {
        mostrarAlerta('Selecciona un producto para actualizar', 'warning');
        return;
    }

    const producto = {
        nombre: $('#nombreProducto').val(),
        tipo: $('#tipoProducto').val(),
        descripcion: $('#descripcionProducto').val(),
        precio: parseFloat($('#precioProducto').val()),
        stock: parseInt($('#stockProducto').val()) || 0,
        imagen_url: $('#imagenProducto').val() || null,
        categoria: $('#categoriaProducto').val() || null
    };

    try {
        const $btnActualizar = $('#btnActualizarProducto');
        const textoOriginal = $btnActualizar.html();
        $btnActualizar.html('<span class="spinner-border spinner-border-sm"></span> Actualizando...').prop('disabled', true);

        const response = await $.ajax({
            url: `/api/productos/${productoEditando}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(producto)
        });

        mostrarAlerta(response.mensaje || 'Producto actualizado exitosamente', 'success');
        limpiarFormulario();
        cargarProductos();
        
        $btnActualizar.html(textoOriginal).prop('disabled', false);
        
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        mostrarAlerta(error.responseJSON?.error || 'Error al actualizar el producto', 'danger');
        $('#btnActualizarProducto').html('<i class="bi bi-pencil"></i> Actualizar').prop('disabled', false);
    }
}

// ===================================================================
// ELIMINAR PRODUCTO
// ===================================================================
async function eliminarProducto(id, nombre) {
    if (!await confirmarAccion(`¿Eliminar "${nombre}"?`, 'Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const response = await $.ajax({
            url: `/api/productos/${id}`,
            method: 'DELETE',
            contentType: 'application/json'
        });

        mostrarAlerta(response.mensaje || 'Producto eliminado exitosamente', 'success');
        cargarProductos();
        
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        mostrarAlerta(error.responseJSON?.error || 'Error al eliminar el producto', 'danger');
    }
}

// ===================================================================
// LIMPIAR FORMULARIO
// ===================================================================
function limpiarFormulario() {
    productoEditando = null;
    $('#productoId').val('');
    $('#formProducto')[0].reset();
    $('#formProducto').removeClass('was-validated');
    $('#formProducto .is-valid, #formProducto .is-invalid').removeClass('is-valid is-invalid');
    
    // Animación
    $('#formProducto').addClass('animate__animated animate__fadeIn');
    setTimeout(() => {
        $('#formProducto').removeClass('animate__animated animate__fadeIn');
    }, 500);
}

// ===================================================================
// FUNCIÓN PARA MOSTRAR ALERTAS
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
// FUNCIÓN PARA CONFIRMAR ACCIONES
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

console.log('✅ Módulo de Productos configurado correctamente');