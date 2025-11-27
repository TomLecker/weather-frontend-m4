$.getJSON("https://api.openweathermap.org/data/2.5/weather", {
  q: "Santiago",
  units: "metric",
  lang: "es",
  appid: "dde20e016575f6c815cad2cdf562bfc7",
})
  .done(function (data) {
    // ✔ Aquí SI existe "data"
    console.log(data); // Para verificar lo que llega
    $("#ciudadNombre").text(data.name);
    $("#temperatura").text(data.main.temp + "°C");
  })
  .fail(function (xhr) {
    console.error("Error en la API:", xhr.responseText);
  });

const ciudades = [
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

const apiKey = "dde20e016575f6c815cad2cdf562bfc7";

ciudades.forEach((ciudad) => {
  $.getJSON(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      q: ciudad,
      units: "metric",
      lang: "es",
      appid: apiKey,
    },
    function (data) {
      const temp = data.main.temp;
      const humedad = data.main.humidity;
      const viento = data.wind.speed;
      const icon = data.weather[0].icon;
      const urlIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      $("#contenedorTarjetas").append(`
        <div class="col-md-3">
          <div class="card card--main h-100 text-center" id="${ciudad.replace(/\s+/g, '-')}">
            <div class="card__body" >
              <h5 class="card__title">${ciudad}</h5>
              <img src="${urlIcon}" alt="${data.weather[0].description}">
              <p class="card__text">${data.weather[0].description}</p>
              <p class="card__text">🌡️ ${temp}°C</p>
              <p class="card__text">💧 Humedad: ${humedad}%</p>
              <p class="card__text">💨 Viento: ${viento} m/s</p>
              <a href="#" class="btn btn-primary" onclick=verDetalles('${ciudad}')> Ver detalle</a>
            </div>
          </div>
        </div>
      `);
    }
  );
});


function verDetalles(ciudad) {
  window.location.href = `detalles.html?ciudad=${encodeURIComponent(ciudad)}`;
}
