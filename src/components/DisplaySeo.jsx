import React, {useState} from "react";
import { useEffect } from "react";

export default function DisplaySeo () {
  const [url, setUrl] = useState('')
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [domain, setDomain] = useState('');
  // const [userId, setUserId] = useState('');
  const [lighthouseData, setLighthouseData] = useState({});

  const runLighthouse = async (e) => {
    try {
        e.preventDefault();
        const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
        setUrl(currentTab);
        const response = await fetch('http://localhost:8080/api/lighthouse', {
        method: 'POST',
        body: JSON.stringify({ url : currentTab[0].url}),
        headers: {
          'Content-Type': 'application/json'
        }
        });
        if (!response.ok){
          throw new Error(response.statusText)
        };
        const report = await response.json();
        let parsed = JSON.parse(report.report);
        await setLighthouseData(parsed)
        console.log(parsed);
    } catch(err) {
      console.log(err)
    }
  };
  // useEffect(() => {
  //   //console.log(lighthouseData);
  // }, [lighthouseData]);

   console.log(lighthouseData);

  return (
    <div>
      <button onClick={runLighthouse}>Run lighthouse</button>
      <p>{url && url[0].url}</p>

      {lighthouseData.categories ? <p>{lighthouseData.categories.seo.score}</p> : null}

    </div>
  )

};
