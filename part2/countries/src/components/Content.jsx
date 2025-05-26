import Countries from './Countries'
import Country from './Country'

const Content = ({countries, selectCountry}) => {

    if (countries.length > 10) {
        return <p>Too many matches, be more specific</p>
    }
    else if (countries.length > 1){
        return (<Countries countries={countries} selectCountry={selectCountry} />)
    }

    else if (countries.length === 1) {
        return <Country country={countries[0]}/>
    }

    return <p>No matches... </p>

}

export default Content;