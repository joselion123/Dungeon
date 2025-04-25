document.addEventListener("DOMContentLoaded", () => {
    leerApi();

    const form = document.getElementById("form-aprendiz");
    form.addEventListener("submit", guardarAprendiz);
});

const url = "http://localhost:3000/aprendices";
let editando = false;

async function leerApi() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        mostrarTabla(data);
    } catch (err) {
        console.log("Error al leer la API:", err);
    }
}

function mostrarTabla(aprendices) {
    const cuerpoTabla = document.querySelector("#tabla-aprendices tbody");
    cuerpoTabla.innerHTML = "";

    aprendices.forEach(aprendiz => {
        const fila = document.createElement("tr");
        let matricula = aprendiz.estaMatriculado ? "Sí" : "No";

        fila.innerHTML = `
            <td>${aprendiz.id}</td>
            <td>${aprendiz.nombre}</td>
            <td>${aprendiz.apellido}</td>
            <td>${matricula}</td>
            <td>${aprendiz.email}</td>
            <td><img src="${aprendiz.foto}" alt="Foto" width="100" height="100"></td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="abrirFormulario(${aprendiz.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminar(${aprendiz.id})">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

 
function abrirFormulario(id = null) {
    const modalTitulo = document.getElementById("modalTitulo");
    const form = document.getElementById("form-aprendiz");
    form.reset();
    editando = false;

    if (id) {
        modalTitulo.textContent = "Editar Aprendiz";
        document.getElementById("id").value = id;
        editando = true;

        fetch(`${url}/${id}`)
            .then(res => res.json())
            .then(aprendiz => {
                document.getElementById("nombre").value = aprendiz.nombre;
                document.getElementById("apellido").value = aprendiz.apellido;
                document.getElementById("email").value = aprendiz.email;
                document.getElementById("foto").value = aprendiz.foto;
                document.getElementById("matriculado").checked = aprendiz.estaMatriculado;
            });
    } else {
  
        modalTitulo.textContent = "Agregar Aprendiz";

    }

    const modal = new bootstrap.Modal(document.getElementById("formModal"));
    modal.show();
}


async function guardarAprendiz(e) {
    e.preventDefault();

    const apellido = document.getElementById("apellido").value;
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const foto = document.getElementById("foto").value;
    const estaMatriculado = document.getElementById("matriculado").checked;

    const aprendiz = { nombre, apellido, email, foto, estaMatriculado };

    try {
        if (editando) {
            const id = document.getElementById("aprendiz-id").value;
            await fetch(`${url}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aprendiz)
            });
        } else {
            await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aprendiz)
            });
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById("formModal"));
        modal.hide();
        leerApi();  
    } catch (err) {
        console.log("Error al guardar aprendiz:", err);
    }
}

async function eliminar(id) {
    if (confirm("¿Estás seguro de eliminar este aprendiz?")) {
        try {
            await fetch(`${url}/${id}`, {
                method: "DELETE"
            });
            leerApi();
        } catch (err) {
            console.log("Error al eliminar aprendiz:", err);
        }
    }
}
