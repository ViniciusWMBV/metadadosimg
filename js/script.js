// script.js
document.getElementById('imageForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const arrayBuffer = event.target.result;
            EXIF.getData(file, function() {
                const allMetaData = EXIF.getAllTags(this);
                displayMetadata(allMetaData);
                displayGPSData(allMetaData);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

function displayMetadata(metadata) {
    const metadataDiv = document.getElementById('metadata');
    metadataDiv.innerHTML = '<h2>Metadados da Imagem:</h2>';
    if (Object.keys(metadata).length === 0) {
        metadataDiv.innerHTML += '<p>Nenhum metadado encontrado.</p>';
    } else {
        const list = document.createElement('ul');
        for (const [key, value] of Object.entries(metadata)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${key}: ${value}`;
            list.appendChild(listItem);
        }
        metadataDiv.appendChild(list);
    }
}

function displayGPSData(metadata) {
    const metadataDiv = document.getElementById('metadata');
    
    if (metadata.GPSLatitude && metadata.GPSLongitude) {
        const latitude = metadata.GPSLatitude;
        const longitude = metadata.GPSLongitude;

        // Convert latitude and longitude from EXIF format to decimal degrees
        const lat = convertDMSToDecimal(latitude);
        const lon = convertDMSToDecimal(longitude);

        const gpsDiv = document.createElement('div');
        gpsDiv.innerHTML = `
            <h2>Localização GPS:</h2>
            <p>Latitude: ${lat}° ${latitude[2] > 0 ? 'N' : 'S'}</p>
            <p>Longitude: ${lon}° ${longitude[2] > 0 ? 'E' : 'W'}</p>
            <p><a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank">Ver no Google Maps</a></p>
        `;
        metadataDiv.appendChild(gpsDiv);
    } else {
        const gpsDiv = document.createElement('div');
        gpsDiv.innerHTML = '<h2>Localização GPS:</h2><p>Dados de GPS não encontrados.</p>';
        metadataDiv.appendChild(gpsDiv);
    }
}

function convertDMSToDecimal(dms) {
    if (!dms || dms.length < 3) return 0;

    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];

    return degrees + (minutes / 60) + (seconds / 3600);
}
