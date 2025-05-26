const Countries = ({countries, selectCountry}) => {
    return (
        <ul>
            {countries.map((country) => (            
                <li key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => selectCountry(country)}>show</button>
                </li>            
            ))}
        </ul>
    )
}

export default Countries;