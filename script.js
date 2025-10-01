document.addEventListener('DOMContentLoaded', () => {
    // INSCRIPCIÓN
    const formInscripcion = document.getElementById('formInscripcion');

    formInscripcion.addEventListener('submit', async(e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombreInscripcion').value;
        const clase = document.getElementById('claseInscripcion').value;

        try {
            const response = await fetch('/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, clase })
            });

            const result = await response.json();
            alert(result.mensaje);
        } catch (error) {
            console.error('Error al enviar datos:', error);
            alert('Hubo un problema al enviar tu inscripción');
        }
    });

    // ELIMINAR INSCRIPCIÓN
    const formEliminar = document.getElementById('formEliminar');

    formEliminar.addEventListener('submit', async(e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreEliminar').value;

        try {
            const res = await fetch(`/eliminar-inscripcion/${nombre}`, { method: 'DELETE' });
            const data = await res.json();
            alert(data.mensaje);
        } catch (error) {
            console.error('Error al eliminar inscripción:', error);
            alert('Hubo un problema al eliminar la inscripción');
        }
    });

    // MODIFICAR INSCRIPCIÓN
    const formModificar = document.getElementById('formModificar');

    formModificar.addEventListener('submit', async(e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreModificar').value;
        const nuevaClase = document.getElementById('nuevaClase').value;

        try {
            const res = await fetch('/modificar-inscripcion', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, nuevaClase })
            });
            const data = await res.json();
            alert(data.mensaje);
        } catch (error) {
            console.error('Error al modificar inscripción:', error);
            alert('Hubo un problema al modificar la inscripción');
        }
    });
});