import React, { useState, useEffect } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts"


export default async function Chart(props) {
    const [data, setData] = useState([])


    const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
    useEffect(() => { 
        fetch('http://localhost:8080/api/filterSeoScores', {
        method: 'POST',
        body: JSON.stringify({ 
          userId : props.info.id,
          url : currentTab[0].url
        }),
        headers: {
          'Content-Type': 'application/json'
        }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setData(data.filterSeo)
            })
        .catch((error) => console.log(error.message))
    })
   
    return (
        <LineChart width={300} height={150} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" />
            <Line type="monotone" dataKey="performance" stroke="#82ca9d" />
        </LineChart>
    )

}
