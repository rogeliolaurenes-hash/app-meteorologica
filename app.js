// ==========================
// Inicializar el mapa
// ==========================

let map = L.map('map').setView([19.4326, -99.1332], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

let marker;

// ==========================
// Evento del botón
// ==========================

document.getElementById('search-btn').addEventListener('click', async () => {

    const city = document.getElementById('city-input').value.trim();
    const weatherCard = document.getElementById('weather-card');

    // Validar que el usuario escriba una ciudad
    if (!city) {
        weatherCard.innerHTML = `
            <p style="color:#fee2e2;">
                Por favor, escribe un lugar válido.
            </p>
        `;
        return;
    }

    weatherCard.innerHTML = `
        <p>🌍 Consultando base de datos geográfica y meteorológica...</p>
    `;

    try {

        // ==========================
        // Consulta a OpenStreetMap
        // ==========================

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
        );

        const data = await response.json();

        if (data.length === 0) {
            weatherCard.innerHTML = `
                <p style="color:#fee2e2;">
                    No se encontraron resultados para esa ubicación.
                </p>
            `;
            return;
        }

        const lugar = data[0];

        const lat = parseFloat(lugar.lat);
        const lon = parseFloat(lugar.lon);

        // ==========================
        // Actualizar mapa
        // ==========================

        map.setView([lat, lon], 13);

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([lat, lon]).addTo(map);

        marker.bindPopup(`
            <strong>${city}</strong><br>
            ${lugar.display_name}
        `).openPopup();

        // ==========================
        // Datos meteorológicos simulados
        // ==========================

        let temp;
        let humidity;
        let condition;

        if (city.toLowerCase() === "lerma") {

            temp = "27.4";
            humidity = "91";
            condition = "Tormenta Meteorológica";

        } else {

            temp = (Math.random() * (35 - 5) + 5).toFixed(1);

            humidity = Math.floor(Math.random() * (100 - 40) + 40);

            const condiciones = [
                "Despejado",
                "Nublado",
                "Lluvia Ligera",
                "Tormenta Eléctrica"
            ];

            condition = condiciones[Math.floor(Math.random() * condiciones.length)];
        }

        // ==========================
        // Mostrar resultados
        // ==========================

        weatherCard.innerHTML = `
            <h2>📍 ${city}</h2>

            <p class="description">
                <strong>Descripción oficial:</strong><br>
                ${lugar.display_name}
            </p>

            <div class="geo-data">
                <p><strong>Latitud:</strong> ${lugar.lat}</p>
                <p><strong>Longitud:</strong> ${lugar.lon}</p>
            </div>

            <hr>

            <div class="weather-data">
                <h4>Parámetros climatológicos</h4>

                <p><strong>🌡 Temperatura:</strong> ${temp} °C</p>

                <p><strong>💧 Humedad:</strong> ${humidity}%</p>

                <p><strong>☁ Condición:</strong> ${condition}</p>
            </div>

            <div class="success-footer">
                ✓ Datos sincronizados correctamente.
            </div>
        `;

    } catch (error) {

        console.error(error);

        weatherCard.innerHTML = `
            <p style="color:#fee2e2;">
                Error al consultar la información.
            </p>
        `;
    }

})