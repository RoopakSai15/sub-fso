import { useEffect, useState } from "react"
import get_weather from "../services/weather";

const Weather = ({name, lat, lon}) => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        get_weather(lat, lon).then((weather) => {
            setWeather(weather)
        })
    },[])

    return (
        <>
        <h2>Weather in {name}</h2>
        {
            weather === null ? (
                <p>Loading weather...</p>
            ) : (
                <>
                <p>temperature {weather.main.temp} celsius</p>
                <img 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                />
                <p>wind {weather.wind.speed} m/s</p>
                </>
            )
        }
        </>
    )
}

export default Weather