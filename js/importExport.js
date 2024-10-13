// valores por defecto para preset
const defaultValues = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '18',
    bgColorActivo: 'rgba(255, 0, 0, 0.5)',
    textColorActivo: '#000000',
    borderActivo: '2px solid black',
    bgColorInactivo: 'rgba(255, 255, 255, 1)',
    textColorInactivo: '#000000',
    borderInactivo: '1px solid gray',
    backgroundColor: 'transparent'
};

// capturar todos los valores actuales del formulario y estilos
function obtenerValoresActuales() {
    const divCentral = document.getElementById('divCentral');
    
    return {
        // valores  inputs
        fontFamily: document.getElementById('fontFamily').value || defaultValues.fontFamily,
        fontSize: document.getElementById('fontSize').value || defaultValues.fontSize,
        bgColorActivo: document.getElementById('bgColor').value || defaultValues.bgColorActivo,
        textColorActivo: document.getElementById('textColor').value || defaultValues.textColorActivo,
        borderActivo: document.getElementById('border').value || defaultValues.borderActivo,
        bgColorInactivo: document.getElementById('bgColorInactive').value || defaultValues.bgColorInactivo,
        textColorInactivo: document.getElementById('textColorInactive').value || defaultValues.textColorInactivo,
        borderInactivo: document.getElementById('borderInactive').value || defaultValues.borderInactivo,
        
        // background del divCentral
        backgroundColor: divCentral.style.backgroundColor || defaultValues.backgroundColor,
        backgroundImage: divCentral.style.backgroundImage || ''
    };
}

//  exportar el preset actual
function exportarPreset() {
    const preset = obtenerValoresActuales();
    const presetString = JSON.stringify(preset, null, 2);
    
    const blob = new Blob([presetString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preset-acordes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    document.getElementById('reporte').innerText = 'Preset exportado exitosamente';
}

//  importar un preset
function importarPreset() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const preset = JSON.parse(e.target.result);
                aplicarPreset(preset);
                document.getElementById('reporte').innerText = 'Preset importado exitosamente';
            } catch (error) {
                document.getElementById('reporte').innerText = 'Error al importar el preset: formato inválido';
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

//  aplicar un preset importado
function aplicarPreset(preset) {
    const divCentral = document.getElementById('divCentral');
    const acordes = document.querySelectorAll('.acorde');

    // aplicar valores a los inputs
    if (preset.fontFamily) {
        document.getElementById('fontFamily').value = preset.fontFamily;
        acordes.forEach(acorde => {
            acorde.style.fontFamily = preset.fontFamily;
        });
    }
    
    if (preset.fontSize) {
        document.getElementById('fontSize').value = preset.fontSize;
        acordes.forEach(acorde => {
            acorde.style.fontSize = `${preset.fontSize}px`;
        });
    }
    
    if (preset.bgColorActivo) document.getElementById('bgColor').value = preset.bgColorActivo;
    if (preset.textColorActivo) document.getElementById('textColor').value = preset.textColorActivo;
    if (preset.borderActivo) document.getElementById('border').value = preset.borderActivo;
    if (preset.bgColorInactivo) document.getElementById('bgColorInactive').value = preset.bgColorInactivo;
    if (preset.textColorInactivo) document.getElementById('textColorInactive').value = preset.textColorInactivo;
    if (preset.borderInactivo) document.getElementById('borderInactive').value = preset.borderInactivo;
    
    // aplicar color de fondo al divCentral
    if (preset.backgroundColor) {
        divCentral.style.backgroundColor = preset.backgroundColor;
    }
    if (preset.backgroundImage) {
        divCentral.style.backgroundImage = preset.backgroundImage;
    }
    
    // Aplicar los estilos usando las variables CSS
    document.documentElement.style.setProperty('--bg-color-activo', preset.bgColorActivo || defaultValues.bgColorActivo);
    document.documentElement.style.setProperty('--text-color-activo', preset.textColorActivo || defaultValues.textColorActivo);
    document.documentElement.style.setProperty('--border-activo', preset.borderActivo || defaultValues.borderActivo);
    document.documentElement.style.setProperty('--bg-color-inactivo', preset.bgColorInactivo || defaultValues.bgColorInactivo);
    document.documentElement.style.setProperty('--text-color-inactivo', preset.textColorInactivo || defaultValues.textColorInactivo);
    document.documentElement.style.setProperty('--border-inactivo', preset.borderInactivo || defaultValues.borderInactivo);
    document.documentElement.style.setProperty('--font-family-acorde', preset.fontFamily || defaultValues.fontFamily);
    document.documentElement.style.setProperty('--font-size-acorde', `${preset.fontSize || defaultValues.fontSize}px`);
    
    // llamar a applyStyles si existe
    if (typeof applyStyles === 'function') {
        applyStyles();
    }
}

// listeners para los botones
document.addEventListener('DOMContentLoaded', function() {
    const divCentral = document.getElementById('divCentral');
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    
    // botones de colores (1-6)
    colors.forEach((color, index) => {
        const button = document.getElementById(`boton${index + 1}`);
        if (button) {
            button.addEventListener('click', () => {
                divCentral.style.backgroundColor = color;
                divCentral.style.backgroundImage = '';
            });
        }
    });
    
    // botón de transparencia (7)
    const transparentBtn = document.getElementById('boton7');
    if (transparentBtn) {
        transparentBtn.addEventListener('click', () => {
            divCentral.style.backgroundColor = 'transparent';
            divCentral.style.backgroundImage = '';
        });
    }
    
    // boton subir imagen de fondo
    const uploadButton = document.getElementById('uploadButton');
    const backgroundImageInput = document.getElementById('backgroundImageInput');
    
    if (uploadButton && backgroundImageInput) {
        uploadButton.addEventListener('click', () => {
            backgroundImageInput.click();
        });
        
        backgroundImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    divCentral.style.backgroundImage = `url(${e.target.result})`;
                    divCentral.style.backgroundColor = '';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // listeners para los botones de preset
    const importarPresetBtn = document.getElementById('importarPreset');
    const exportarPresetBtn = document.getElementById('exportarPreset');
    
    if (importarPresetBtn) {
        importarPresetBtn.addEventListener('click', importarPreset);
    }
    
    if (exportarPresetBtn) {
        exportarPresetBtn.addEventListener('click', exportarPreset);
    }
});