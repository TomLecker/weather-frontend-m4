
/*
function obtenerCiudadDeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ciudad");
}

function obtenerDetallesClima(ciudad) {
  $.getJSON(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      q: ciudad,
      units: "metric",
      lang: "es",
      appid: "dde20e016575f6c815cad2cdf562bfc7",
    },

    function (data) {
      const zona = data.timezone;
      const temp = data.main.temp;
      const humedad = data.main.humidity;
      const viento = data.wind.speed;
      const icon = data.weather[0].icon;
      const urlIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      $("#detallesTarjeta").append(
        `<div class="col-md-4">
          <div class="card h-100 text-center">
            <div class="card-body">
              <h5 class="card-title" id="${ciudad}">${ciudad}</h5>
              <img src="${urlIcon}" alt="${data.weather[0].description}">
              <p>${zona}</p>
              <p>${data.weather[0].description}</p>
              <p>🌡️ ${temp}°C</p>
              <p>💧 Humedad: ${humedad}%</p>
              <p>💨 Viento: ${viento} m/s</p>
            </div>
          </div>
        </div>`
      );
    }
  );
}

$(document).ready(function () {
  const ciudad = obtenerCiudadDeURL();
  if (ciudad) {
    obtenerDetallesClima(ciudad);
  } else {
    $("#detallesTarjeta").text("No se recibió la ciudad.");
  }
});
 */

$(document).ready(function() {
    const params = new URLSearchParams(window.location.search);
    const ciudad = params.get("ciudad");

    // Mostrar la ciudad en el HTML
    $("#ciudad").text(ciudad);
});

function obtenerCiudadDeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ciudad");
}

const API_KEY = "dde20e016575f6c815cad2cdf562bfc7";

function obtenerDetallesClima(ciudad) {
$.getJSON("https://api.openweathermap.org/data/2.5/forecast",
    {
     
        q: ciudad,
        appid: API_KEY,
        units: "metric",
        lang: "es"
    },
     function(resp) {

        const lista = resp.list;
        const pronosticos = [];

        // Buscamos un pronóstico por día cercano a las 12:00
        const horasObjetivo = ["12:00:00", "15:00:00", "09:00:00"];

        for (let d = 0; d < 6; d++) {
            const fechaBase = new Date();
            fechaBase.setDate(fechaBase.getDate() + d);
            const dia = fechaBase.toISOString().split("T")[0];

            let encontrado = null;

            for (const h of horasObjetivo) {
                encontrado = lista.find(item =>
                    item.dt_txt.includes(dia) &&
                    item.dt_txt.includes(h)
                );
                if (encontrado) break;
            }

            // Si no hay exacto, uso el más cercano del día
            if (!encontrado) {
                const delDia = lista.filter(item => item.dt_txt.includes(dia));
                if (delDia.length > 0) {
                    encontrado = delDia[Math.floor(delDia.length / 2)];
                }
            }

            if (encontrado) pronosticos.push(encontrado);
        }

        $("#pronostico").empty();

        pronosticos.forEach(p => {
            const fecha = p.dt_txt.split(" ")[0];
            const temp = Math.round(p.main.temp);
            const desc = p.weather[0].description;
            const icon = p.weather[0].icon;

            const tarjeta = `
                <div style="
                    width:150px;
                    background:#f5f5f5;
                    padding:15px;
                    border-radius:10px;
                    text-align:center;
                    box-shadow:0 2px 6px rgba(0,0,0,0.15);
                ">
                    <h4>${fecha}</h4>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icono">
                    <h2>${temp}°C</h2>
                    <p style="margin:0; text-transform:capitalize;">${desc}</p>
                </div>
            `;

            $("#pronostico").append(tarjeta);
        });

    }
)}

$(document).ready(function () {
  const ciudad = obtenerCiudadDeURL();
  if (ciudad) {
    obtenerDetallesClima(ciudad);
  } else {
    $("#detallesTarjeta").text("No se recibió la ciudad.");
  }
});