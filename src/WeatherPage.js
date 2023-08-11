import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import { Cloud, WbSunny, AcUnit, Opacity, CloudOff } from '@material-ui/icons';
import './WeatherPage.css';

const weatherVideos = {
  Clear: 'pkRtgKM_Ll0',
  Clouds: 'Y8ACyHYsb6Q',
  Rain: 'R0NME9W3cR4',
  Snow: 'vz91QpgUjFc',
  Mist: 'R-V5NyN9XKo',
  Fog: 'your_youtube_video_id_for_fog',
  Haze: 'your_youtube_video_id_for_haze',
  Thunderstorm: 'your_youtube_video_id_for_thunderstorm',
  Drizzle: 'your_youtube_video_id_for_drizzle',
  Smoke: 'your_youtube_video_id_for_smoke',
};

const WeatherPage = () => {
  const [query, setQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [threeHourForecast, setThreeHourForecast] = useState([]);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const API_KEY = '8b8c466cdb459e5a49d3dc52ebfa2f36';
  const GOOGLE_GEOCODING_API_KEY = 'AIzaSyD-i6mfq1wXAP4-dOKMoCWCYX0rQR0tyYI';

  const fetchWeatherData = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=${API_KEY}`
      );
      setCurrentWeather(currentWeatherResponse.data);

      const threeHourForecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=${API_KEY}`
      );
      setThreeHourForecast(threeHourForecastResponse.data.list.slice(0, 8));

      const fiveDayForecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=${API_KEY}`
      );
      setFiveDayForecast(fiveDayForecastResponse.data.list.filter((item, index) => index % 8 === 0));

      setLoading(false);
      setShowVideo(true);
    } catch (error) {
      setError('Error fetching weather data. Please try again.');
      setLoading(false);
      setShowVideo(false);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setShowVideo(false);
  };

  const fetchStateInfo = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_GEOCODING_API_KEY}`
      );
      if (response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        const stateComponent = addressComponents.find((component) =>
          component.types.includes('administrative_area_level_1')
        );
        if (stateComponent) {
          return stateComponent.short_name;
        }
      }
    } catch (error) {
      console.error('Error fetching state information:', error);
    }
    return null;
  };

  useEffect(() => {
    if (query) {
      fetchWeatherData(query);
    } else {
      setShowVideo(false);
    }
  }, [query]);

  useEffect(() => {
    if (currentWeather) {
      const { lat, lon } = currentWeather.coord;
      fetchStateInfo(lat, lon).then((state) => {
        setCurrentWeather((prevWeather) => ({ ...prevWeather, state }));
        setShowVideo(false);
      });
    }
  }, [currentWeather]);

  useEffect(() => {
    if (currentWeather && currentWeather.weather[0]?.main in weatherVideos) {
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  }, [currentWeather]);

  return (
    <div className={`weather-page ${showVideo ? 'video-playing' : ''}`}>
      {showVideo && (
        <div className="video-background">
          <iframe
            id="background-video"
            src={`https://www.youtube.com/embed/${weatherVideos[currentWeather?.weather[0]?.main]}?autoplay=1&mute=1&loop=1`}
            title="Background Video"
            frameBorder="0"
          />
        </div>
      )}
      <Container maxWidth="md" className="container">
        <Box my={2} className="content">
          <div className="search-container">
            <TextField
              fullWidth
              label="Enter city name or zipcode"
              value={query}
              onChange={handleInputChange}
              variant="outlined"
              className="search-input"
            />
          </div>
          {loading && <Typography className="loading">Loading...</Typography>}
          {error && <Typography className="error">{error}</Typography>}
          {currentWeather && (
            <div className="current-temp-container">
              <Typography variant="h5" className="location">
                {currentWeather.name}, {currentWeather.state}, {currentWeather.sys.country}
              </Typography>
              <div className="weather-info">
                <div className="weather-icon">
                  {currentWeather.weather[0].main === 'Clear' && <WbSunny />}
                  {currentWeather.weather[0].main === 'Clouds' && <Cloud />}
                  {currentWeather.weather[0].main === 'Rain' && <Opacity />}
                  {currentWeather.weather[0].main === 'Snow' && <AcUnit />}
                  {currentWeather.weather[0].main === 'Mist' && <Opacity />}
                  {currentWeather.weather[0].main === 'Fog' && <CloudOff />}
                </div>
                <Typography className="description">{currentWeather.weather[0].description}</Typography>
                <Typography className="temperature">{currentWeather.main.temp}&deg;F</Typography>
              </div>
            </div>
          )}
         {threeHourForecast.length > 0 && (
  <div className="three-hour-forecast-container">
    <Typography variant="h6">3-Hour Forecast</Typography>
    <div className="forecast-scroll-container">
      {threeHourForecast.map((forecast) => (
        <Card key={forecast.dt} className="weather-card">
          <CardContent>
            <Typography className="forecast-time">
              {new Date(forecast.dt * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
            <div className="weather-icon">
              {forecast.weather[0].main === 'Clear' && <WbSunny />}
              {forecast.weather[0].main === 'Clouds' && <Cloud />}
              {forecast.weather[0].main === 'Rain' && <Opacity />}
              {forecast.weather[0].main === 'Snow' && <AcUnit />}
              {forecast.weather[0].main === 'Mist' && <Opacity />}
              {forecast.weather[0].main === 'Fog' && <CloudOff />}
            </div>
            <Typography className="description">{forecast.weather[0].description}</Typography>
            <Typography className="temperature">{forecast.main.temp}&deg;F</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)}

{fiveDayForecast.length > 0 && (
  <div className="five-day-forecast-container">
    <Typography variant="h6">5-Day Forecast</Typography>
    <div className="forecast-scroll-container">
      {fiveDayForecast.map((forecast) => (
        <Card key={forecast.dt} className="weather-card">
          <CardContent>
            <Typography className="forecast-date">
              {new Date(forecast.dt * 1000).toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
            <div className="weather-icon">
              {forecast.weather[0].main === 'Clear' && <WbSunny />}
              {forecast.weather[0].main === 'Clouds' && <Cloud />}
              {forecast.weather[0].main === 'Rain' && <Opacity />}
              {forecast.weather[0].main === 'Snow' && <AcUnit />}
              {forecast.weather[0].main === 'Mist' && <Opacity />}
              {forecast.weather[0].main === 'Fog' && <CloudOff />}
            </div>
            <Typography className="description">{forecast.weather[0].description}</Typography>
            <div className="temp-container">
              <Typography className="temperature">{forecast.main.temp}&deg;F</Typography>
              <Typography className="high-low-temp">
                High: {forecast.main.temp_max}&deg;F <br></br> Low: {forecast.main.temp_min}&deg;F
              </Typography>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)}

        </Box>
      </Container>
    </div>
  );
  
};

export default WeatherPage;
