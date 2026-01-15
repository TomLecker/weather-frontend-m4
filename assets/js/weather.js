// ===============================
// CONFIGURACIÓN
// ===============================

const API_KEY = "dde20e016575f6c815cad2cdf562bfc7";

const LUGARES = [
  { id: 1, nombre: "Madrid", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 2, nombre: "Barcelona", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 3, nombre: "Valencia", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 4, nombre: "Sevilla", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 5, nombre: "Bilbao", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 6, nombre: "Santiago", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 7, nombre: "Lima", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 8, nombre: "Moscu", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 9, nombre: "Caracas", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
  { id: 10, nombre: "Bogota", tempActual: null, estadoActual: null, icono: null, pronosticoSemanal: [] },
];

// ===============================
// API
// ===============================

async function obtenerClimaActual(ciudad) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
  );
  if (!res.ok) throw new Error("Error al obtener clima actual");
  return res.json();
}

// ===============================
// MAPEO
// ===============================

function mapearClimaActual(apiClima) {
  return {
    tempActual: Math.round(apiClima.main.temp),
    estadoActual: apiClima.weather[0].description,
    icono: apiClima.weather[0].icon
  };
}

// ===============================
// UI
// ===============================

function crearTarjeta(lugar) {
  const iconUrl = `https://openweathermap.org/img/wn/${lugar.icono}@2x.png`;

  return `
    <div class="card card--main h-100 text-center">
      <div class="card__body">
        <h5 class="card__title">${lugar.nombre}</h5>

        <img src="${iconUrl}" alt="${lugar.estadoActual}">
        <p style="text-transform:capitalize">${lugar.estadoActual}</p>
        <p class="temp" >🌡️ <b>${lugar.tempActual}°C</b></p>

        <a href="#"
           class="btn btn-primary"
           onclick="verDetalles('${lugar.nombre}')">
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

  for (const lugar of LUGARES) {
    try {
      const apiData = await obtenerClimaActual(lugar.nombre);
      const clima = mapearClimaActual(apiData);

      lugar.tempActual = clima.tempActual;
      lugar.estadoActual = clima.estadoActual;
      lugar.icono = clima.icono;

      contenedor.innerHTML += crearTarjeta(lugar);
    } catch (error) {
      console.error(`Error con ${lugar.nombre}`, error);
    }
  }

  localStorage.setItem("lugares", JSON.stringify(LUGARES));
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