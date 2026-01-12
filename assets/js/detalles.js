$(document).ready(function () {
  const ciudad = obtenerCiudadDeURL();
  if (ciudad) {
    $("#ciudad").text(ciudad);
    obtenerDetallesClima(ciudad);
  } else {
    $("#detallesTarjeta").text("No se recibió la ciudad.");
  }
});

// ===============================
// CONFIG
// ===============================
const API_KEY = "dde20e016575f6c815cad2cdf562bfc7"; // reemplaza por tu clave real
const HORAS_OBJETIVO = ["12:00:00", "15:00:00", "09:00:00"];

// ===============================
// FUNCIONES AUXILIARES
// ===============================
function obtenerCiudadDeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ciudad");
}

function formatearFecha(dt_txt) {
  return dt_txt.split(" ")[0];
}

// ===============================
// FUNCIONES PRINCIPALES
// ===============================
async function obtenerDetallesClima(ciudad) {
  try {
    // Llamada a forecast 5 días / cada 3 horas
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
    );

    if (!res.ok) throw new Error("Error al obtener datos de la API");

    const data = await res.json();
    const lista = data.list;

    const pronosticos = [];

    // Tomar 6 días incluyendo hoy
    for (let d = 0; d < 6; d++) {
      const fechaBase = new Date();
      fechaBase.setDate(fechaBase.getDate() + d);
      const dia = fechaBase.toISOString().split("T")[0];

      // Buscar hora objetivo
      let encontrado = null;
      for (const h of HORAS_OBJETIVO) {
        encontrado = lista.find(
          (item) => item.dt_txt.includes(dia) && item.dt_txt.includes(h)
        );
        if (encontrado) break;
      }

      // Si no hay exacto, usar el más cercano del día
      if (!encontrado) {
        const delDia = lista.filter((item) => item.dt_txt.includes(dia));
        if (delDia.length > 0) {
          encontrado = delDia[Math.floor(delDia.length / 2)];
        }
      }

      if (encontrado) pronosticos.push(encontrado);
    }

    // ===============================
    // RENDERIZAR
    // ===============================
    $("#pronostico").empty();

    pronosticos.forEach((p) => {
      const fecha = formatearFecha(p.dt_txt);
      const temp = Math.round(p.main.temp);
      const temp_min = Math.round(p.main.temp_min);
      const temp_max = Math.round(p.main.temp_max);
      const desc = p.weather[0].description;
      const icon = p.weather[0].icon;

      const tarjeta = `
        <div class="card card--main h-100 text-center">
          <div class="card__body">
            <h4>${fecha}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icono">
            <h2>${temp}°C</h2>
            <p style="margin:0; text-transform:capitalize;">${desc}</p>
            <p style="margin:0;">🌡️ Min: ${temp_min}°C / Max: ${temp_max}°C</p>
          </div>
        </div>
      `;

      $("#pronostico").append(tarjeta);
    });
  } catch (error) {
    console.error("Error obteniendo el pronóstico:", error);
    $("#detallesTarjeta").text("No se pudo cargar el pronóstico.");
  }
}