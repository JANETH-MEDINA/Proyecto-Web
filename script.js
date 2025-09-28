document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const clase = document.getElementById('clase').value;

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
});
