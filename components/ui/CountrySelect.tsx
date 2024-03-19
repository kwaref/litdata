import {countries} from 'countries-list'
import React from 'react'

const CountrySelect = ({country, setCountry}: {country: string; setCountry: any}) => {
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event)
  }

  return (
    <>
      <label className="mb-1 block text-sm font-medium" htmlFor="country">
        Country
      </label>
      <select
        id="country"
        className="focus:ring-primary-400 form-select w-full rounded-md border border-border p-2 focus:ring"
        value={country}
        onChange={handleCountryChange}
      >
        <option value="">Selecciona un país</option>
        {Object.keys(countries).map(countryCode => (
          <option key={countryCode} value={countryCode}>
            {/* @ts-ignore */}
            {`${countries[countryCode].emoji} ${countries[countryCode].name}`}
          </option>
        ))}
      </select>
    </>
  )
}

export default CountrySelect
