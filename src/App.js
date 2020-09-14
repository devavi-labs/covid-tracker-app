import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem
} from '@material-ui/core'
import './app.css'

const BASE_API = 'https://disease.sh/v3/covid-19'

const App = () => {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')

  useEffect(() => {
    const getCountriesData = async () => {
      const url = BASE_API + '/countries'
      await fetch(url)
        .then(res => res.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          })
          )
          setCountries(countries)
        })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)
  }

  return (
    <div className="app">
      <div className='app__header'>
        <h1>COVID-19 Tracker</h1>
        <FormControl className='app__dropdown'>
          <Select
            variant='outlined'
            value={country}
            onChange={onCountryChange}
          >
            <MenuItem

              value='worldwide'
            >
              Worldwide
            </MenuItem>
            {
              countries.map(country => <MenuItem
                key={country.value}
                value={country.value}
              >
                {country.name}
              </MenuItem>
              )
            }
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default App;
