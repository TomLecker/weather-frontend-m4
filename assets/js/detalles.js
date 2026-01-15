$(document).ready(function () {
  const ciudad = obtenerCiudadDeURL();

  if (!ciudad) {
    $("#detallesTarjeta").text("No se recibió la ciudad.");
    return;
  }

  $("#ciudad").text(ciudad);

  cargarClimaActual(ciudad);
  cargarPronostico(ciudad);
});

// ===============================
// AUX
// ===============================
function obtenerCiudadDeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ciudad");
}

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

async function obtenerPronostico(ciudad) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
  );
  if (!res.ok) throw new Error("Error al obtener pronóstico");
  return res.json();
}

// ===============================
// MAPEO
// ===============================
function mapearClimaActual(data) {
  return {
    temp: Math.round(data.main.temp),
    estado: data.weather[0].description,
    icono: data.weather[0].icon,
    humedad: data.main.humidity,
    viento: data.wind.speed.toFixed(1),
  };
}

function mapearPronosticoSemanal(apiData) {
  const lista = apiData.list;
  const pronostico = [];

  for (let d = 0; d < 6; d++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + d);
    const dia = fecha.toISOString().split("T")[0];

    const delDia = lista.filter(item => item.dt_txt.startsWith(dia));
    if (!delDia.length) continue;

    const min = Math.round(Math.min(...delDia.map(i => i.main.temp_min)));
    const max = Math.round(Math.max(...delDia.map(i => i.main.temp_max)));
    const estado = delDia[0].weather[0].description;
    const icono = delDia[0].weather[0].icon;

    // temperatura “actual” para la tarjeta: primer registro del día
    const tempActual = Math.round(delDia[0].main.temp);

    const viento = (delDia.reduce((acc, i) => acc + i.wind.speed, 0) / delDia.length).toFixed(1);
    const humedad = Math.round(delDia.reduce((acc, i) => acc + i.main.humidity, 0) / delDia.length);

    pronostico.push({ dia, min, max, estado, icono, viento, humedad, tempActual });
  }

  return pronostico;
}

// ===============================
// UI
// ===============================
function renderClimaActual(clima) {
  const contenedor = $("#climaActual");
  contenedor.empty();

  const iconUrl = `https://openweathermap.org/img/wn/${clima.icono}@2x.png`;

  contenedor.append(`
    <div class="card card--main text-center">
      <h5>Clima actual</h5>
      <img src="${iconUrl}" alt="${clima.estado}">
      
      <p style="text-transform:capitalize">${clima.estado}</p>
      <p>🌡️ ${clima.temp}°C</p>
      <p>💧 Humedad: ${clima.humedad}%</p>
      <p>💨 Viento: ${clima.viento} m/s</p>
    </div>
  `);
}

function renderPronostico(pronostico) {
  const contenedor = $("#pronostico");
  contenedor.empty();

  pronostico.forEach(p => {
    const iconUrl = `https://openweathermap.org/img/wn/${p.icono}@2x.png`;

    contenedor.append(`
      <div class="card card--main h-100 text-center">
        <div class="card__body">
          <h5 class="card__title">${p.dia}</h5>
          <img src="${iconUrl}" alt="${p.estado}">
          <p class="temp-actual">🌡️<b> ${p.tempActual} °C</b></p>
          <p style="text-transform:capitalize">${p.estado}</p>
          <p>🌡️ Min ${p.min}°C / Max ${p.max}°C</p>
          <p>💧 Humedad: ${p.humedad}%</p>
          <p>💨 Viento: ${p.viento} m/s</p>
        </div>
      </div>
    `);
  });
}

function renderResumenSemanal(pronostico) {
  const max = Math.max(...pronostico.map(p => p.max));
  const min = Math.min(...pronostico.map(p => p.min));
  const promedio = Math.round(
    pronostico.reduce((acc, p) => acc + (p.min + p.max) / 2, 0) / pronostico.length
  );

  const estados = pronostico.map(p => p.estado);
  const estadoPredominante = estados.sort(
    (a, b) =>
      estados.filter(v => v === a).length - estados.filter(v => v === b).length
  ).pop();

  $("#tempMaxSemana").text(`🌡️ Máxima semanal: ${max}°C`);
  $("#tempMinSemana").text(`❄️ Mínima semanal: ${min}°C`);
  $("#promedioTempSemana").text(`📊 Promedio semanal: ${promedio}°C`);
  $("#estadoSemana").text(`☁️ Estado predominante: ${estadoPredominante}`);
}

// ===============================
// DATA
// ===============================
function guardarPronosticoEnLugar(ciudad, pronostico) {
  const lugares = JSON.parse(localStorage.getItem("lugares")) || [];
  const lugar = lugares.find(l => l.nombre === ciudad);

  if (lugar) {
    lugar.pronosticoSemanal = pronostico;
    localStorage.setItem("lugares", JSON.stringify(lugares));
  }
}

// ===============================
// MAIN
// ===============================
async function cargarClimaActual(ciudad) {
  try {
    const data = await obtenerClimaActual(ciudad);
    const clima = mapearClimaActual(data);
    renderClimaActual(clima);
  } catch (error) {
    console.error(error);
    $("#climaActual").text("No se pudo cargar el clima actual.");
  }
}

async function cargarPronostico(ciudad) {
  try {
    const apiData = await obtenerPronostico(ciudad);
    const pronostico = mapearPronosticoSemanal(apiData);

    renderPronostico(pronostico);
    renderResumenSemanal(pronostico);
    guardarPronosticoEnLugar(ciudad, pronostico);
  } catch (error) {
    console.error(error);
    $("#detallesTarjeta").text("No se pudo cargar el pronóstico.");
  }
}



// Función para obtener la mayor temperatura máxima de un conjunto de pronósticos

function MayorTemperatura(pronosticos) {
  return Math.max(...pronosticos.map(p => p.max));
}

// spread operator (...) para extraer las temperaturas máximas de cada pronóstico
// y luego aplicar Math.max para encontrar la mayor de ellas.

function MenorTemperatura(pronosticos) {
  return Math.min(...pronosticos.map(p => p.min));
}

// Función para calcular la temperatura promedio de un conjunto de pronósticos


function promedioTemperaturas(pronosticos) {
  const suma = pronosticos.reduce((acc, p) => acc + (p.min + p.max) / 2, 0);
  return Math.round(suma / pronosticos.length);
}

// Función para determinar el estado del tiempo más común en un conjunto de pronósticos
// Utiliza un enfoque de conteo y ordenamiento para encontrar el estado más frecuente.
// La función map crea un array de estados, luego se ordena basado en la frecuencia de cada estado
// y se selecciona el último elemento (el más frecuente).
// Esto permite identificar rápidamente el estado del tiempo predominante en la semana.



function estadoSemanal(pronosticos) {
  const estados = pronosticos.map(p => p.estado);
  const estadoMasComun = estados.sort(
    (a, b) =>
      estados.filter(v => v === a).length -
      estados.filter(v => v === b).length
  ).pop();
  return estadoMasComun;
}

function renderResumenSemanal(pronostico) {
  $("#tempMaxSemana").text(`🌡️ Máxima semanal: ${MayorTemperatura(pronostico)}°C`);
  $("#tempMinSemana").text(`❄️ Mínima semanal: ${MenorTemperatura(pronostico)}°C`);
  $("#promedioTempSemana").text(`📊 Promedio semanal: ${promedioTemperaturas(pronostico)}°C`);
  $("#estadoSemana").text(`☁️ Estado predominante: ${estadoSemanal(pronostico)}`);
}