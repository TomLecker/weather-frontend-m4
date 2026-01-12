// ===============================
// CONFIGURACIÓN
// ===============================
const CIUDADES = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Bilbao",
  "Santiago",
  "Lima",
  "Moscu",
  "Caracas",
  "Bogota",
];

// ===============================
// FUNCIONES API
// ===============================

// Obtener clima actual por ciudad
async function obtenerClimaActual(ciudad) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
  );

  if (!res.ok) throw new Error("Error clima actual");

  return res.json();
}


// ===============================
// RENDER UI
// ===============================
function crearTarjeta(ciudad, clima, hoy) {
  const icon = clima.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return `
    <div class="card card--main h-100 text-center">
      <div class="card__body">
        <h5 class="card__title">${ciudad}</h5>
        <img src="${iconUrl}" alt="${clima.weather[0].description}">
        <p>${clima.weather[0].description}</p>
        <p>🌡️ ${clima.main.temp}°C</p>
        <p>💧 Humedad: ${clima.main.humidity}%</p>
        <p>💨 Viento: ${clima.wind.speed} m/s</p>
        <a href="#" class="btn btn-primary" onclick="verDetalles('${ciudad}')">
          Ver detalle
        </a>
      </div>
    </div>
  `;
}

// ===============================
// MAIN
// ===============================
async function cargarClima() {
  const contenedor = document.getElementById("contenedorTarjetas");
  contenedor.innerHTML = "";

  for (const ciudad of CIUDADES) {
    try {
      // Ejecutar ambas llamadas en paralelo
      const [clima, hoy] = await Promise.all([
        obtenerClimaActual(ciudad),
      ]);

      contenedor.innerHTML += crearTarjeta(ciudad, clima, hoy);
    } catch (error) {
      console.error(`Error con ${ciudad}:`, error);
    }
  }
}

// ===============================
// NAVEGACIÓN
// ===============================
function verDetalles(ciudad) {
  window.location.href = `detalles.html?ciudad=${encodeURIComponent(ciudad)}`;
}

// ===============================
// INIT
// ===============================
cargarClima();