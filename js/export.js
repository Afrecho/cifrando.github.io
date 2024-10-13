
let listaImagenes = [];

// función para el botón Exportar GIF
function exportGif() {
    // contar el número de acordes
    const acordes = document.querySelectorAll('.acorde');
    const numAcordes = acordes.length;

    // Obtener el BPM ingresado por el usuario
    const bpm = parseInt(document.getElementById('bpm').value) || 120; // valor por defecto 120 si no hay entrada

    // obtener el compás seleccionado
    const compas = document.getElementById('compas').value || '4/4'; // valor por defecto 4/4 si no hay selección

    // calculo de milisegundos por compás
    let beatsPerBar;
    switch (compas) {
        case '3/4':
            beatsPerBar = 3;
            break;
        case '6/8':
            beatsPerBar = 6;
            break;
        default:
            beatsPerBar = 4; 
    }

    const msPerBeat = 60000 / bpm; // 60000 ms en un minuto
    const msPerBar = msPerBeat * beatsPerBar;

    // reiniciar listaImagenes antes de capturar nuevos frames
    listaImagenes = [];

    // GENERAR Y GUARDAR EL PNG
    function capturarFrame(index) {
        if (index > numAcordes) {
            return; // finalizar si ya se capturaron todos los frames
        }

        // seleccionar todos los acordes
        const acordes = document.querySelectorAll('.acorde');

        // primero, reiniciar todos los acordes a inactivo
        acordes.forEach(ac => {
            ac.classList.remove('activo');
            ac.classList.add('inactivo');
        });

        // asignar la clase 'activo' solo al acorde actual, excepto para el frame 0
        if (index > 0 && acordes[index - 1]) {
            acordes[index - 1].classList.remove('inactivo');
            acordes[index - 1].classList.add('activo');
        }

        // GENERAR Y GUARDAR EL PNG
        html2canvas(document.getElementById("divCentral")).then(function (canvas) {
            canvas.toBlob(function (blob) {
                listaImagenes.push(blob);
        
                // capturar el siguiente frame
                capturarFrame(index + 1);
            }, 'image/png');
        });
    }

    // iniciar la captura de frames, comenzando con el frame 0
    capturarFrame(0);
}


// FUNCION DESCARGAR LA LISTA






function descargarLista() {

    // comprobar que se guardan y descargan las imagenes
 // descargarImagenes ();

 document.getElementById('reporte').innerText = 'se guardaron ' + listaImagenes.length + ' pngs, ahi vamos';
  mostrarAlgunaImagen();  
  //alert("imprimelo");
    descargarImagenes();
    crearGifDesdeLista();

}




// asignar las funciones a los botones cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const exportGifButton = document.getElementById('exportGifButton');
    if (exportGifButton) {
        exportGifButton.addEventListener('click', exportGif);

    } else {

    }

    const exportarListaButton = document.getElementById('exportarLista');
    if (exportarListaButton) {
        exportarListaButton.addEventListener('click', descargarLista);

    } else {

    }
});




  // CREAR EL GIF

  function crearGifDesdeLista() {
    // asegurar de que listaImagenes esté definida y llena de datos PNG
    if (!Array.isArray(listaImagenes) || listaImagenes.length === 0) {
        document.getElementById('reporte2').innerText = 'La lista de imágenes está vacía';
        return;
    }

    document.getElementById('reporte3').innerText = 'Iniciando la creación del GIF...';

    // crear un nuevo GIF usando gif.js
    const gif = new GIF({
        workers: 2,
        quality: 10
    });

    let imagesLoaded = 0;
    const pngImages = [];

    // convertir cada blob a PNG y almacenarlo en memoria
    listaImagenes.forEach((blob, index) => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((pngBlob) => {
                pngImages.push(pngBlob);
                imagesLoaded++;
                document.getElementById('reporte3').innerText = `Imagen ${index + 1} convertida a PNG. Total imágenes convertidas: ${imagesLoaded}`;

                // añadir la imagen al GIF cuando todas estén convertidas
                if (imagesLoaded === listaImagenes.length) {
                    pngImages.forEach((pngBlob, idx) => {
                        const pngImg = new Image();
                        pngImg.src = URL.createObjectURL(pngBlob);
                        pngImg.onload = () => {
                            gif.addFrame(pngImg, { delay: 600 }); // añadir cada imagen con un retraso de 600ms
                            document.getElementById('reporte3').innerText = `Imagen ${idx + 1} añadida al GIF`;
                        };
                    });

                    // renderizar el GIF
                    gif.render();
                    document.getElementById('reporte3').innerText = 'Renderizando el GIF...';
                }
            }, 'image/png');
        };
        img.onerror = () => {
            document.getElementById('reporte3').innerText = `Error al cargar la imagen ${index + 1}`;
        };
    });

    // seguimiento del progreso
    gif.on('progress', function(p) {
        const progress = Math.round(p * 100);
        document.getElementById('reporteGif').innerText = `Progreso del GIF: ${progress}%`;
    });

    // cuando todas las imágenes han sido añadidas
    gif.on('finished', function(blob) {
        document.getElementById('reporte3').innerText = 'GIF creado exitosamente';
        
        // crear url
        const url = URL.createObjectURL(blob);

        // mostrar el gif en el contenedor de frames
        const framesContainer = document.getElementById('framesContainer');
        const imgElement = document.createElement('img');
        imgElement.src = url;
        framesContainer.innerHTML = ''; // Limpiar el contenedor
        framesContainer.appendChild(imgElement);

        // liberar memoria
        URL.revokeObjectURL(url);
    });
}




function mostrarAlgunaImagen() {
    const framesContainer = document.getElementById("framesContainer");

    // limpiar el contenido previo
    framesContainer.innerHTML = '<h3>Frames Exportados:</h3>'; // Reintroducimos el título

    // verificamos si la lista no está vacía
    if (typeof listaImagenes !== 'undefined' && listaImagenes.length > 0) {
        // creamos un elemento de imagen
        const imgElement = document.createElement("img");
        imgElement.src = URL.createObjectURL(listaImagenes[3]); // Establecemos el src con el primer elemento de la lista
        imgElement.alt = "Imagen"; // Texto alternativo para la imagen (opcional)
        imgElement.style.maxWidth = "100%"; // Opcional: ajustar tamaño

        // añadir la imagen al div
        framesContainer.appendChild(imgElement);
    } else {
        document.getElementById('reporte2').innerText = 'La lista no está definida o está vacía';
    }
}



 // BOTON EXPORTAR
 function descargarImagenes() {
    if (listaImagenes.length === 0) {
        alert("No hay imágenes para descargar. Por favor, genere las imágenes primero usando el botón 'Exportar GIF'.");
        return;
    }

    listaImagenes.forEach((blob, index) => {
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `imagen_${index + 1}.png`;  // nombre de archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);  // liberar memoria
    });

    // AQUI LLAMAR A FUNCION QUE CREA Y EXPORTA

    document.getElementById('framesList').textContent = `Se han descargado ${listaImagenes.length} imágenes.`;
}
