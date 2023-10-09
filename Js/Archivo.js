
let files = [];
console.log('hola');
fetch(`http://localhost:5258/ApiArchivos/Archivo/ObtenerDocumentos`, {
  method: 'GET'
})
.then(response => response.json())
.then(result => {
  files = result;
  displayFiles(result)
});


function AddFile() {
  const inputArchivo = document.getElementById("inputArchivo");
  inputArchivo.innerHTML="";
  const archivo = inputArchivo.files[0]; // Obtener el archivo seleccionado

  if (archivo) {
    // Crear un objeto FormData y agregar el archivo seleccionado
    const formData = new FormData();
    formData.append("fichero", archivo); // Puedes ajustar el nombre "fichero" según tu API

    // Realizar la solicitud fetch con el archivo como cuerpo
    fetch("http://localhost:5258/ApiArchivos/Archivo/SubirDocumento", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // La solicitud fue exitosa
          console.log("Archivo enviado correctamente");
          // Cerrar el modal y limpiar el campo de input
          
          inputArchivo.value = ""; // Esto limpia el campo de input
        } else {
          // La solicitud falló, manejar el error
          console.error("Error en la solicitud");
        }
      })
      .catch((error) => {
        // Manejar errores de la solicitud
        console.error("Error:", error);
      });
  }
}


function displayFiles(regs){
  const tbodyTable = document.getElementById("tbodyTable");
  tbodyTable.innerHTML = '';

  regs.forEach((reg, index) => {
    let img ="";
    if( reg.extension == "pdf")
    {
      img = "../Assets/pdf.png"
    }else if( reg.extension == "docx")
    {
      img = "../Assets/docs.png"
    } else {
      img = "../Assets/img.png"
    }
    tbodyTable.innerHTML += `
    <tr>
      <td scope="row">${index+1}</th>
      <td >${reg.nombre}</td>
      <td><img src="${img}" alt="" style="height: 30px;">${reg.extension}</td>
      <td>${reg.tamanio.toFixed(2)} Kb</td>
      <td><a onclick="dowload('${reg.nombre}.${reg.extension}')" target="_blank" href="${reg.ubicacion}" download><img src="../Assets/descargar.png" alt="descarga" style="height: 35px;"></a></td>
      <td><a onclick="deleteFile(${reg.id})" href="#"><img src="../Assets/eliminar.png" alt="descarga" style="height: 35px;"></a></td>
    </tr>`;
  })
}
  
function deleteFile(id) {
  fetch(`http://localhost:5258/ApiArchivos/Archivo/Eliminar/${id}`, {
    method: 'DELETE'
  }).then(() => window.location.reload());
}


function dowload(nombreArchivo) {
  const formData = new FormData();
  formData.append("nombreFichero", nombreArchivo);

  fetch(`http://localhost:5258/ApiArchivos/Archivo/BajarDocumento`, {
  method: 'POST',
  body: formData
})
.then(response => {
  if (response.ok) {
    return response.blob();
  } else {
    throw new Error('Error en la descarga');
  }
})
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
})
.catch(error => {
  console.error('Error:', error);
});
} 
