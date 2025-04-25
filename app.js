document.addEventListener("DOMContentLoaded", leerApi);

const url = "http://localhost:3000/aprendices"; 

function leerApi() {
    fetch(url)
        .then(res => res.json())
        .then(data => mostrarTabla(data))
        .catch(err => {
            console.log("Error al leer la API:", err);
        });
}

function mostrarTabla(aprendices) {
    const cuerpoTabla = document.querySelector("#tabla-aprendices tbody");
    cuerpoTabla.innerHTML = "";

    aprendices.forEach(aprendiz => {
        const fila = document.createElement("tr");
        let matricula=""
        if (aprendiz.estaMatriculado){
            matricula="Si"
        }else{
            matricula="No"
        }
        fila.innerHTML = `
            <td>${aprendiz.id}</td>
            <td>${aprendiz.nombre}</td>
            <td>${matricula}</td>
            <td>${aprendiz.email}</td>
        `;

        cuerpoTabla.appendChild(fila);
    });
}
