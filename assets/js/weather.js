

$.getJSON("https://api.openweathermap.org/data/2.5/weather", {
    q: "Santiago",
    units: "metric",
    lang: "es",
    appid: "dde20e016575f6c815cad2cdf562bfc7"
})
.done(function(data) {   // ✔ Aquí SI existe "data"
    console.log(data);   // Para verificar lo que llega
    $("#ciudadNombre").text(data.name);
    $("#temperatura").text(data.main.temp + "°C");
})
.fail(function(xhr){
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
  "Buenos Aires",
  "Mexico City",
  "Bogota"
];

const apiKey = "dde20e016575f6c815cad2cdf562bfc7";

ciudades.forEach(ciudad => {
  $.getJSON("https://api.openweathermap.org/data/2.5/weather", {
      q: ciudad,
      units: "metric",
      lang: "es",
      appid: apiKey,
  }, function(data){

      const temp = data.main.temp;
      const humedad = data.main.humidity;
      const viento = data.wind.speed;
      const icon = data.weather[0].icon;
      const urlIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      $("#contenedorTarjetas").append(`
        <div class="col-md-4">
          <div class="card h-100 text-center">
            <div class="card-body">
              <h5 class="card-title">${ciudad}</h5>
              <img src="${urlIcon}" alt="${data.weather[0].description}">
              <p>${data.weather[0].description}</p>
              <p>🌡️ ${temp}°C</p>
              <p>💧 Humedad: ${humedad}%</p>
              <p>💨 Viento: ${viento} m/s</p>
              <button class="btn btn-primary" onclick="verDetalles('${ciudad}')">Ver detalle</button>
            </div>
          </div>
        </div>
      `);
  });
});

function verDetalles(ciudad) {
  // Puedes usar query string
  window.location.href = `detalles.html?ciudad=${encodeURIComponent(ciudad)}`;
}