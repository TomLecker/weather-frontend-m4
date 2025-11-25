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

