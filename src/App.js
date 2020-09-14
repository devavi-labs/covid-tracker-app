import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem, Card, CardContent
} from '@material-ui/core'
import 'leaflet/dist/leaflet.css'

import './app.css'
import InfoBox from './info_box';
import Map from './map';
import Table from './table';
import { sortData, prettyPrintStat } from './utils'
import LineGraph from './line_graph'

export const BASE_API = 'https://disease.sh/v3/covid-19'

const App = () => {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796
  })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    const getWorldwideInfo = async () => {
      const url = BASE_API + '/all'
      await fetch(url)
        .then(res => res.json())
        .then(data => {
          setCountryInfo(data)
        })
    }

    getWorldwideInfo()
  }, [])

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
          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries)
          setMapCountries(data)
        })
    }

    getCountriesData()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    const url = (countryCode === 'worldwide')
      ? BASE_API + '/all'
      : BASE_API + `/countries/${countryCode}`
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode)
        setCountryInfo(data)
        const newMapCenter = (countryCode === 'worldwide')
          ? [
            34.80746,
            -40.4796
          ]
          : [
            data.countryInfo.lat,
            data.countryInfo.long
          ]

        setMapCenter(newMapCenter)
        setMapZoom(4)
      })
  }

  return (
    <div className='app'>
      <div className='app__left'>
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
                countries.map((country, index) => <MenuItem
                  key={index}
                  value={country.value}
                >
                  {country.name}
                </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox
            isRed={true}
            active={casesType === 'cases'}
            onClick={() => setCasesType('cases')}
            title='Coronavirus cases'
            stat={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={() => setCasesType('recovered')}
            title='Recovered'
            stat={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed={true}
            active={casesType === 'deaths'}
            onClick={() => setCasesType('deaths')}
            title='Death'
            stat={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />

      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>
            Cases by Country
          </h3>
          <Table countries={tableData} />

          <h3 className='app__graphTitle'>
            Worldwide new {casesType}
          </h3>
          <LineGraph
            className='app__graph'
            casesType={casesType}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
