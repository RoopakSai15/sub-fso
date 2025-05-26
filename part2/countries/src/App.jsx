import { useEffect, useState } from 'react'
import getAllCountries from './services/countries'
import CountryFilter from './components/CountryFilter'
import Content from './components/Content'

function App() {
  const [filterStr, setFilterStr] = useState("")
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    getAllCountries().then((response) => {
      setAllCountries(response)
    })
  },[])

  const handleFilter = (event) => {
    const newFilter = event.target.value
    const countries = 
      newFilter.trim().length === 0 
        ? allCountries 
        : allCountries.filter((country) => 
          country.name.common
            .toLowerCase()
            .includes(newFilter.trim().toLowerCase())
    )
    setFilterStr(newFilter)
    setFilteredCountries(countries)
  }

  const selectCountry = (country) => {
    setFilteredCountries([country])
  }

  return (
    <>
    <CountryFilter filterStr={filterStr} handleFilter={handleFilter}/>
    <div>
      <Content countries={filteredCountries} selectCountry={selectCountry}/>
    </div>
    </>
  )
}

export default App


