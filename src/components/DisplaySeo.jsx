import { fontWeight } from "@mui/system";
import React, {useState , useEffect} from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import '../metrics.css';

export default function DisplaySeo (props) {
  const [url, setUrl] = useState('')
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [domain, setDomain] = useState('');
  // const [userId, setUserId] = useState('');
  const [lighthouseData, setLighthouseData] = useState({});
  //const [speedIndexColor, setSpeedIndexColor] = useState('');

  // useEffect(() => {
  //   console.log(speedIndexColor);
  // }, [speedIndexColor]);

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
        //console.log(parsed.audits['speed-index'].displayValue)
        await setLighthouseData(parsed)
        console.log(parsed);
    } catch(err) {
      console.log(err)
    }
  };

  // useEffect(() => {
  //   // console.log(lighthouseData.audits['speed-index'].displayValue);
  // }, [lighthouseData]);

  const sendDataToDatabase = async (e) => {

    e.preventDefault();
    try {
      console.log(lighthouseData.categories);
      console.log(lighthouseData.requestedUrl)
      const response = await fetch('http://localhost:8080/api/seoItems', {
        method: "POST",
        body: JSON.stringify({
          userId: props.info.id, 
          url: lighthouseData.requestedUrl, 
          audits: lighthouseData.audits, 
          categories: lighthouseData.categories, 
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
   // tip: be midnful of the fact that after running lighthouse it'd take lighthouseData
   // some time to populate, so using seoScore or performanceScore would work best with
   // conditional rendering 
  //  const seoScore = lighthouseData.categories.performance.id.score;
  //  const performanceScore = lighthouseData.categories.performance.id.score;
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
    textSize: "24px",
  }
  

  // useEffect(() => {
  //   if (lighthouseData && lighthouseData.audits && lighthouseData.audits['speed-index']) {

  //     const speedIndex = lighthouseData.audits['speed-index'].displayValue
  //     let color = '';

  //     if (speedIndex >= 0 && speedIndex <= 3.4) {
  //       color = 'green';
  //       console.log(color);
  //     } else if (speedIndex > 3.4 && speedIndex <= 5.8) {
  //       color = 'orange';
  //       console.log(color);
  //     } else if (speedIndex > 5.8) {
  //       color = 'red';
  //       console.log(color);
  //     }
  //     setSpeedIndexColor(color);
  //     console.log(speedIndexColor)
  //   }
  // }, [lighthouseData.audits]);

  // console.log(speedIndexColor);

  const filterOpportunities = () => {
    let opportunities = [];
    for (const auditName in lighthouseData.audits) {
      const audit = lighthouseData.audits[auditName];
      if (audit.details && audit.details.type === 'opportunity') {
        opportunities.push({
          description: audit.description.replace(/\[Learn more\]\(.*\)/, ''),
          url: (() => {
            const match = audit.description.match(/\[Learn more\]\((.*)\)/);
            if (!match) {
              return null;
            }
            return match[1];
          })()
        });
      }
    }
    return opportunities;
  };


  return (
    <div id="seo-div">
      <div>
        <button id="run-LH-btn" onClick={runLighthouse}>Run lighthouse</button>
        <p>{url && url[0].url}</p>
        {lighthouseData && lighthouseData.categories ? <button onClick={sendDataToDatabase}> save data</button> : null}
      </div>
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
        <h2 style={{color: 'rgb(70, 70, 70)'}}>Metrics</h2>
        <div id="seo-bin-values">
          <div id="seo-metrics-box">
            <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>2.5ms</p>
            <p><strong>Heading</strong></p>
            <div id="metrics-desc-div">Description Lorem ipsum dolor sit amet consectetur </div>
          </div>
          <div id="seo-metrics-box">
            <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>2.5ms</p>
            <p><strong>Heading</strong></p>
            <div id="metrics-desc-div">Description Lorem ipsum dolor sit amet consectetur </div>
          </div>
        </div>
      </div>

      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ flex: "1 1 calc(50% - 5px)", padding: "5px" }}>
          <h2>Metrics</h2>
          <hr />
          <div>
            {lighthouseData.audits ? (
              <div className={`metrics ${(() => {
                const speedIndex = lighthouseData.audits['speed-index'].displayValue;
                let color = '';
                if (speedIndex >= 0 && speedIndex <= 3.4) {
                  color = 'green';
                  console.log(color)
                } else if (speedIndex > 3.4 && speedIndex <= 4) {
                  color = 'orange';
                  console.log(color)
                } else if (speedIndex > 4) {
                  color = 'red';
                  console.log(color)
                }
                console.log(color)
                return color;
                })()}`}
              >
               <p>Speed Index: {lighthouseData.audits['speed-index'].displayValue}</p>
              {lighthouseData.audits['speed-index'].description.includes('[Learn more]') ? (
                <p>
                  {lighthouseData.audits['speed-index'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['speed-index'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </p>
              ) : (
                <p>{lighthouseData.audits['speed-index'].description}</p>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div>
            {lighthouseData.audits ? (
              <div className={`metrics`}>
                <p> First Contentful Paint: {lighthouseData.audits['first-contentful-paint'].displayValue} </p>
                {lighthouseData.audits['first-contentful-paint'].description.includes('[Learn more]') ? (
                <p>
                  {lighthouseData.audits['first-contentful-paint'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['first-contentful-paint'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </p>
              ) : (
                <p>{lighthouseData.audits['first-contentful-paint'].description}</p>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div>
            {lighthouseData.audits ? (
              <div className={`metrics`}>
                <p> Largest Contentful Paint: {lighthouseData.audits['largest-contentful-paint'].displayValue} </p>
                {lighthouseData.audits['largest-contentful-paint'].description.includes('[Learn more]') ? (
                <p>
                  {lighthouseData.audits['largest-contentful-paint'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['largest-contentful-paint'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </p>
              ) : (
                <p>{lighthouseData.audits['largest-contentful-paint'].description}</p>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div>
            {lighthouseData.audits && lighthouseData.audits['time-to-interactive'] ? (
              <div className={`metrics`}>
                <p> Time to Interactive: {lighthouseData.audits['time-to-interactive'].displayValue} </p>
                {lighthouseData.audits['time-to-interactive'].description.includes('[Learn more]') ? (
                <p>
                  {lighthouseData.audits['time-to-interactive'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['time-to-interactive'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </p>
              ) : (
                <p>{lighthouseData.audits['time-to-interactive'].description}</p>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div>
            {lighthouseData.audits && lighthouseData.audits['cumulative-layout-shift'] ? (
              <div className={`metrics`}>
                <p> Cumulative Layout Shift: {lighthouseData.audits['cumulative-layout-shift'].displayValue} </p>
                {lighthouseData.audits['cumulative-layout-shift'].description.includes('[Learn more]') ? (
                <p>
                  {lighthouseData.audits['cumulative-layout-shift'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['cumulative-layout-shift'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </p>
              ) : (
                <p>{lighthouseData.audits['cumulative-layout-shift'].description}</p>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div>
            {lighthouseData.audits && lighthouseData.audits['total-blocking-time'] ? (
              <div className={`metrics`}>
                <p> Total Blocking Time: {lighthouseData.audits['total-blocking-time'].displayValue} </p>
                {lighthouseData.audits['total-blocking-time'].description.includes('[Learn more]') ? (
                <p>
                  {lighthouseData.audits['total-blocking-time'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['total-blocking-time'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </p>
              ) : (
                <p>{lighthouseData.audits['total-blocking-time'].description}</p>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* <div>
            {lighthouseData ? (
              <>
                <h2>Opportunites</h2>
                <hr />
                <div>
                  {filterOpportunities().map((opportunity, index) => (
                    <div key={index}>
                      <p>{opportunity.description}</p>
                      {opportunity.url && (
                        <a href={opportunity.url}>Learn more</a>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No lighthouse data available</p>
            )}
          </div> */}

        </div>
        <div style={{ flex: "1 1 calc(50% - 5px)", padding: "5px" }}>
          
        </div>
      </div>
     
    </div>
  )

};

{/* <div>
            {lighthouseData ? (
              <>
                {opportunities.map((opportunity, index) => (
                  <div key={index}>
                    <p>{opportunity.description}</p>
                    {opportunity.url && (
                      <a href={opportunity.url}>Learn more</a>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p>No lighthouse data available</p>
            )}
          </div> */}

/**
 * 
 * 
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
