import React, { useState, useEffect } from "react"
import { Bar } from 'react-chartjs-2'
import populationData from './populations.json'

export default function Countries() {
    const [countries, setCountries] = useState([])
    const [search, setSearch] = useState("")
    const [countryPopulations, setCountryPopulations] = useState()
    const [reverse, setReverse] = useState(false)

    let displayCountries = countries
                                .filter(country => country.Country.toLowerCase().includes(search.toLowerCase()) && country.TotalConfirmed > 0 && countryPopulations.has(country.Country))
                                .sort((a, b) => (b.TotalConfirmed/countryPopulations.get(b.Country)) - (a.TotalConfirmed/countryPopulations.get(a.Country)))
    
    if (reverse) {
        displayCountries.reverse()
    }

    displayCountries = displayCountries.slice(0, 10)

    const data = {
        labels: displayCountries.map(country => country.Country), 
        datasets: [
            {
                label: 'Percent Confirmed Cases',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: displayCountries.map(country => country.TotalConfirmed * 100 /countryPopulations.get(country.Country))
            }
        ]
    }

    useEffect(() => {
        fetch("https://api.covid19api.com/summary")
            .then(res => res.json())
            .then(res => setCountries(res.Countries))
            .catch(error => console.log(error))

        let populationMap = new Map()

        for (const populationDatum of populationData) {
            if (populationDatum["Country Name"] === "United States") {
                populationMap.set("US", populationDatum["Value"]);
            } else if (populationDatum["Country Code"] === "KOR") {
                populationMap.set("South Korea", populationDatum["Value"])
            } else {
                populationMap.set(populationDatum["Country Name"], populationDatum["Value"]);
            }
        }

        setCountryPopulations(populationMap)
    }, [])

    return (
        <div>
            <h2>What Percent of the Population Got Covid-19?</h2>
            <label> Search for country: 
                <input
                    className = "Search"
                    type = "text"
                    placeholder = "Search"
                    value = {search}
                    onChange = {event => setSearch(event.target.value)}
                />
            </label>
            <label> Reverse Sorting:
                <input 
                    type = "checkbox"
                    name = "reverse"
                    checked = {reverse}
                    onClick = {() => setReverse(!reverse)}
                />
            </label>
            <Bar
                data={data}
                width={100}
                height={300}
                options={{
                    maintainAspectRatio: false
                }}
            />
        </div>
    )
}