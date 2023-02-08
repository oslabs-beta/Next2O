import React, {useState , useEffect} from "react";

export default function SeoHistory (props) {


  const filterSeoAndPerformanceScore = async (e) => {
    try {
        e.preventDefault();
        const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
        const response = await fetch('http://localhost:8080/api/filterSeoScores', {
        method: 'POST',
        body: JSON.stringify({ 
          userId : props.info.id,
          url : currentTab[0].url
        }),
        headers: {
          'Content-Type': 'application/json'
        }
        });
        if (!response.ok){
          throw new Error(response.statusText)
        };
        const data = await response.json();
        //console.log(parsed.audits['speed-index'].displayValue)
        console.log(data);
    } catch(err) {
      console.log(err)
    }
  };


  return (
    <div>
      <p>History</p>
    </div>
  )
};