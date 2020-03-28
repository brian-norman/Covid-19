import React, { useState, useEffect } from "react"
import { Bar } from 'react-chartjs-2'
import populations from './populations.json'

export default function Test() {
    const [countries, setCountries] = useState([])

    const data = {
        labels: countries
                    .sort((a, b) => b.TotalConfirmed - a.TotalConfirmed)
                    .slice(0, 8)
                    .map(country => country.Country),
        datasets: [
            {
                label: 'Confirmed Cases',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',            
                data: countries
                        .sort((a, b) => b.TotalConfirmed - a.TotalConfirmed)
                        .slice(0,8)
                        .map(country => country.TotalConfirmed)
            }
        ]
    }

    useEffect(() => {
        fetch( "https://api.covid19api.com/summary" )
            .then( res => res.json() )
            .then( res => setCountries(res.Countries))
            .catch( error => console.log(error) )
    }, [])

    return (
        <div>
            <h2>Countries and Infected Population</h2>
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