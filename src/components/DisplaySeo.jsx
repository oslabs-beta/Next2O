
import React, {useState , useEffect} from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

export default function DisplaySeo (props) {
  const [url, setUrl] = useState('')
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [domain, setDomain] = useState('');
  // const [userId, setUserId] = useState('');
  const [lighthouseData, setLighthouseData] = useState({});
  const [debounce, setDebounce] = useState(false)

  const runLighthouse = async (e) => {
    if (debounce === true) return
    setDebounce(true)
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
        setDebounce(false)
        console.log(parsed);
    } catch(err) {
      console.log(err)
    }
  };
  // useEffect(() => {
  //   //console.log(lighthouseData);
  // }, [lighthouseData]);
  const sendDataToDatabase = async (e) => {

    e.preventDefault();
    try {
      console.log(lighthouseData.categories);
      console.log(lighthouseData.requestedUrl)
      const response = await fetch('http://localhost:8080/api/addItems', {
        method: "POST",
        body: JSON.stringify({
          userId: props.info.id, 
          url: lighthouseData.requestedUrl, 
          audits: lighthouseData.audits, 
          categories: lighthouseData.categories,
          categoryGroups: lighthouseData.categoryGroups 
        }),
      headers: {
        "content-Type": "application/json"
      }
      });
      console.log(response)
      if (!response.ok){
        throw new Error(response.statusText)
      }
      const data = await response.json();
      console.log(data);
      } catch (err) {
        console.log(err)
      }
  };
   console.log(lighthouseData);
   const testVal1 = 94;
   const testVal2 = 50;
   const testVal3 = 22;
   const avgVal = Math.round((testVal1 + testVal2 + testVal3) / 3)

   const filledStyle = {
    backgroundColor: '#3F51B5',
    textColor: '#fff',
    textSize: '24px',
    pathColor: '#fff',
    trailColor: 'transparent'
  }

   const thinStyle = {
    textColor: "#3F51B5",
    pathColor: "#3F51B5",
  }
  

  return (
    <div id="seo-div">
      <button onClick={runLighthouse}>Run lighthouse</button>
      <p>{url && url[0].url}</p>
      {lighthouseData && lighthouseData.categories ? <button onClick={sendDataToDatabase}> save to database</button> : null}

      <h2 id='h2-scores'>Overall Score:</h2>
      <div id="seo-wheel-total">
        <CircularProgressbar value={avgVal} text={`${avgVal}`} counterClockwise
        styles={buildStyles(thinStyle)} />
      </div>

      <div id="seo-wheels">
        <div id="seo-val-and-title">
          <div id="seo-val-wrap">
            <CircularProgressbar value={testVal1} text={`${testVal1}`} counterClockwise
            background backgroundPadding={6}
            styles={buildStyles(filledStyle)} />
          </div>
          <p>Speed</p>
        </div>

        <div id="seo-val-and-title">
          <div id="seo-val-wrap">
            <CircularProgressbar value={testVal2} text={`${testVal2}`} counterClockwise
            background backgroundPadding={6}
            styles={buildStyles(filledStyle)} />
          </div>
          <p>SEO</p>
        </div>

        <div id="seo-val-and-title">
          <div id="seo-val-wrap">
            <CircularProgressbar value={testVal3} text={`${testVal3}`} counterClockwise
            background backgroundPadding={6}
            styles={buildStyles(filledStyle)} />
          </div>
          <p>Network</p>
        </div>
      </div>

      <div id="seo-bins">
        <div id="seo-bin-val"></div>
      </div>
    </div>
  )

};


/**
 *  <div id="seo-val-wrap">
          <div id="seo-val-outer">
            <div id="seo-val-inner">{testVal1}</div>
          </div>

          <svg id='seo-svg' xmlns="http://www.w3.org/2000/svg" version="1.1" width="50px" height="50px">
            <defs>
              <linearGradient id="GradientColor">
                <stop offset="0%" stop-color="#e91e63" />
                <stop offset="100%" stop-color="#673ab7" />
              </linearGradient>
            </defs>
            <circle cx="26" cy="26" r="20" stroke-linecap="round" />
          </svg>
        </div>
 */