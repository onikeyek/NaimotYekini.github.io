// ===== Weather App =====

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

let currentLat  = 62.8924;
let currentLon  = 27.6770;
let currentCity = 'Kuopio';

function weatherIcon(code) {
  if (code === 0)  return '☀️';
  if (code <= 2)   return '⛅';
  if (code <= 3)   return '☁️';
  if (code <= 48)  return '🌫️';
  if (code <= 67)  return '🌧️';
  if (code <= 77)  return '❄️';
  if (code <= 82)  return '🌦️';
  return '⛈️';
}

function weatherDesc(code) {
  if (code === 0)  return 'Clear sky';
  if (code <= 2)   return 'Partly cloudy';
  if (code <= 3)   return 'Overcast';
  if (code <= 48)  return 'Foggy';
  if (code <= 55)  return 'Drizzle';
  if (code <= 67)  return 'Rainy';
  if (code <= 77)  return 'Snowy';
  if (code <= 82)  return 'Rain showers';
  return 'Thunderstorm';
}

function uvLabel(uv) {
  if (uv <= 2)  return 'Low';
  if (uv <= 5)  return 'Moderate';
  if (uv <= 7)  return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

function aqiLabel(aqi) {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy';
  return 'Hazardous';
}

function fmtTime(iso) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

async function loadWeather(city, lat, lon) {
  document.getElementById('heroCity').textContent = city;
  document.getElementById('heroTemp').textContent = '--°';
  document.getElementById('heroCondition').innerHTML = '<span>⏳</span> Fetching...';
  document.getElementById('statHumidity').textContent = '--';
  document.getElementById('statWind').textContent = '--';
  document.getElementById('statPressure').textContent = '--';
  document.getElementById('statPrecip').textContent = '--';
  document.getElementById('hourlyGrid').innerHTML = Array(6).fill(
    `<div class="hourly-card skeleton"><div class="hourly-time">--</div><div class="hourly-icon">·</div><div class="hourly-temp">--°</div></div>`
  ).join('');
  document.getElementById('dailyForecast').innerHTML = '<div class="daily-placeholder">Loading...</div>';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,weather_code,surface_pressure,precipitation_probability` +
      `&hourly=temperature_2m,weather_code&hourly_steps=1` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max` +
      `&timezone=auto&forecast_days=7&models=best_match`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    const c = d.current;

    document.getElementById('heroTemp').textContent    = `${Math.round(c.temperature_2m)}°`;
    document.getElementById('heroFeels').textContent   = `${Math.round(c.apparent_temperature)}°`;
    document.getElementById('heroVis').textContent     = '10 km';
    document.getElementById('heroCondition').innerHTML =
      `<span>${weatherIcon(c.weather_code)}</span> ${weatherDesc(c.weather_code)}`;

    document.getElementById('statHumidity').textContent = `${c.relative_humidity_2m}%`;
    document.getElementById('statWind').innerHTML       = `${c.wind_speed_10m} <span class="stat-unit">km/h</span>`;
    document.getElementById('statPressure').innerHTML   = `${Math.round(c.surface_pressure)} <span class="stat-unit">hPa</span>`;
    document.getElementById('statPrecip').textContent   = `${c.precipitation_probability ?? '--'}%`;

    const now = new Date();
    const slots = [];
    for (let i = 0; i < d.hourly.time.length && slots.length < 12; i++) {
      if (new Date(d.hourly.time[i]) >= now)
        slots.push({ time: d.hourly.time[i], temp: d.hourly.temperature_2m[i], code: d.hourly.weather_code[i] });
    }
    document.getElementById('hourlyGrid').innerHTML = slots.map((s, idx) => `
      <div class="hourly-card ${idx === 0 ? 'now' : ''}">
        <div class="hourly-time">${idx === 0 ? 'NOW' : new Date(s.time).getHours().toString().padStart(2,'0') + ':00'}</div>
        <div class="hourly-icon">${weatherIcon(s.code)}</div>
        <div class="hourly-temp">${Math.round(s.temp)}°</div>
      </div>`).join('');

    const maxT = Math.max(...d.daily.temperature_2m_max);
    const minT = Math.min(...d.daily.temperature_2m_min);
    const range = maxT - minT || 1;
    document.getElementById('dailyForecast').innerHTML = d.daily.time.map((t, i) => {
      const day = i === 0 ? 'Today' : DAYS[new Date(t).getDay()];
      const hi  = Math.round(d.daily.temperature_2m_max[i]);
      const lo  = Math.round(d.daily.temperature_2m_min[i]);
      const pct = Math.round(((hi - minT) / range) * 100);
      return `<div class="daily-row">
        <span class="daily-day">${day}</span>
        <span class="daily-icon">${weatherIcon(d.daily.weather_code[i])}</span>
        <div class="daily-bar-wrap"><div class="daily-bar" style="width:${pct}%"></div></div>
        <span class="daily-temps">${hi}° <span>${lo}°</span></span>
      </div>`;
    }).join('');

    const uv = d.daily.uv_index_max[0] ?? 0;
    document.getElementById('uvIndex').textContent = Math.round(uv);
    document.getElementById('uvLabel').textContent = uvLabel(uv);
    document.getElementById('uvFill').style.width  = `${Math.min(uv / 11 * 100, 100)}%`;

    const aqi = Math.floor(Math.random() * 60) + 20;
    document.getElementById('aqiValue').textContent = aqi;
    document.getElementById('aqiLabel').textContent = aqiLabel(aqi);
    document.getElementById('aqiFill').style.width  = `${Math.min(aqi / 200 * 100, 100)}%`;

    document.getElementById('sunrise').textContent = fmtTime(d.daily.sunrise[0]);
    document.getElementById('sunset').textContent  = fmtTime(d.daily.sunset[0]);

  } catch (err) {
    document.getElementById('heroTemp').textContent = '--';
    document.getElementById('heroCondition').innerHTML = '⚠️ Failed to load';
    document.getElementById('hourlyGrid').innerHTML =
      `<div class="hourly-placeholder">Error: ${err.message}</div>`;
  }
}

document.querySelectorAll('.city-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLat  = parseFloat(btn.dataset.lat);
    currentLon  = parseFloat(btn.dataset.lon);
    currentCity = btn.dataset.city;
    loadWeather(currentCity, currentLat, currentLon);
  });
});

loadWeather('Kuopio', '62.8924', '27.6770');
