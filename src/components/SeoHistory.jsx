import React, {useState , useEffect} from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts"

export default function SeoHistory (props) {
  const [data, setData] = useState([])

  const filterSeoAndPerformanceScore = async () => {
  
    try {
        // e.preventDefault();
        const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
        const response = await fetch('http://localhost:8080/api/filterSeoScores', {
        method: 'POST',
        body: JSON.stringify({ 
          userId : props.id,
          url : currentTab[0].url
        }),
        headers: {
          'Content-Type': 'application/json'
        }
        })

        if (!response.ok){
          throw new Error(response.statusText)
        };
        const seoData = await response.json();
        //console.log(parsed.audits['speed-index'].displayValue)
        setData(seoData.filterSeo)
        console.log(seoData);
    } catch(err) {
      console.log(err)
    }
  };
 useEffect(() => {
    filterSeoAndPerformanceScore()
 }, [])

  return (
    <div>
      <p>History</p>
      <LineChart width={300} height={150} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" />
            <Line type="monotone" dataKey="performance" stroke="#82ca9d" />
        </LineChart>
    </div>
  )
  
};