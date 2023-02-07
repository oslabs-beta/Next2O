import React, { useState, useEffect } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts"


export default function Chart() {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('./data.json')
        .then((res) => res.json())
        .then((data) => setData(data.data))
        .catch((error) => console.log(error.message))
    }, [])
   
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
