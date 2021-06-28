import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto')

if (btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl
        console.log(urlProyecto)
        Swal.fire({
            title: 'Deseas borrar este proyecto',
            text: 'No se podrá recuperar',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                const url = `${location.origin}/proyectos/${urlProyecto}`
                axios.delete(url, { params: { urlProyecto } })
                    .then(function (resp) {
                        Swal.fire(
                            'Proyecto eliminado',
                            resp.data,
                            'success'
                        )
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000)
                    })
                    .catch(() => {
                        Swal.fire(
                            'Hubo un error',
                            'No se pudo eliminar el proyecto',
                            'error'
                        )
                    })
            }
        })
    })
}

export default btnEliminar