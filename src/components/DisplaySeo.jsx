import { fontWeight } from "@mui/system";
import React, {useState , useEffect} from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import Queries from "./Queries";
// import Chart from "./LineChart";
import SeoHistory from "./SeoHistory"
import 'react-circular-progressbar/dist/styles.css';

import '../metrics.css';

export default function DisplaySeo (props) {
  const [url, setUrl] = useState('')
  const [lighthouseData, setLighthouseData] = useState({});

  //const [speedIndexColor, setSpeedIndexColor] = useState('');

  // useEffect(() => {
  //   console.log(speedIndexColor);
  // }, [speedIndexColor]);
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
        //console.log(parsed.audits['speed-index'].displayValue)
        await setLighthouseData(parsed)
        setDebounce(false)
        
        // console.log(parsed);
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
      
      const response = await fetch('http://localhost:8080/api/seoItems', {
        method: "POST",
        body: JSON.stringify({
          userId: props.id, 
          url: lighthouseData.requestedUrl, 
          audits: lighthouseData.audits, 
          seoScore: lighthouseData.categories.seo.score, 
          performanceScore: lighthouseData.categories.performance.score
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
      //console.log(lighthouseData.categories.seo.score, lighthouseData.categories.performance.scroe)
      } catch (err) {
        console.log(err)
      }
  };
   // tip: be midnful of the fact that after running lighthouse it'd take lighthouseData
   // some time to populate, so using seoScore or performanceScore would work best with
   // conditional rendering 

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

  { !lighthouseData || !lighthouseData.categories ? 
      <div>
        <button id="run-LH-btn" onClick={runLighthouse}>Run Analysis</button>

      </div>
      : 
      <>
      {/* <h2 id='h2-scores'>Overall Score:</h2>
      <div id="seo-wheel-total">
        <CircularProgressbar value={avgVal} text={`${avgVal}`} counterClockwise
        styles={buildStyles(thinStyle)} />
      </div>  */}
      <h1 style={{margin: '20px', color: 'rgb(70, 70, 70)'}}>Metrics</h1>

      <div id="seo-wheels">
      {lighthouseData.categories ? <div id="seo-val-and-title">
          <div id="seo-val-wrap">
             <CircularProgressbar value={Math.round(lighthouseData.categories.seo.score * 100)} text={`${Math.round(lighthouseData.categories.seo.score * 100)}`} counterClockwise
            background backgroundPadding={6}
            styles={buildStyles(filledStyle)} /> 
          </div>
          <p style={{ padding: '5px' }}>SEO</p> 
        </div> : null}

        { lighthouseData.categories ?<div id="seo-val-and-title">
          <div id="seo-val-wrap">
            <CircularProgressbar value={Math.round(lighthouseData.categories.performance.score * 100)} text={`${Math.round(lighthouseData.categories.performance.score * 100)}`} counterClockwise
            background backgroundPadding={6}
            styles={buildStyles(filledStyle)} /> 
          </div>
          <p style={{ padding: '5px' }}>Performance</p>
        </div> : null}
      </div>

      {/* <div id="seo-bins">
        <h2 style={{color: 'rgb(70, 70, 70)'}}>Metrics</h2>
        <div id="seo-bin-values">

      
          {/* <div id="seo-metrics-box">
            <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>2.5ms</p>
            <p><strong>Heading</strong></p>
            <div id="metrics-desc-div">Description Lorem ipsum dolor sit amet consectetur </div>
          </div> */}

        {/* </div>
      </div> */}

      
      {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ flex: "1 1 calc(50% - 5px)", padding: "5px" }}>
           */}

            
              {/* <div className={`metrics ${(() => {
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
              > */}

          <div>
              {lighthouseData.audits ? (
              <div id="seo-metrics-box">
                <p><strong>Speed Index: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>{lighthouseData.audits['speed-index'].displayValue}</p>
              {lighthouseData.audits['speed-index'].description.includes('[Learn more]') ? (
                <div id="metrics-desc-div">
                  {lighthouseData.audits['speed-index'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['speed-index'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </div>
              ) : (
                <div>{lighthouseData.audits['speed-index'].description}</div>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div>
              {lighthouseData.audits ? (
              <div id="seo-metrics-box">
                <p><strong>First Contentful Paint: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>{lighthouseData.audits['first-contentful-paint'].displayValue}</p>
              {lighthouseData.audits['first-contentful-paint'].description.includes('[Learn more]') ? (
                <div id="metrics-desc-div">
                  {lighthouseData.audits['first-contentful-paint'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['first-contentful-paint'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </div>
              ) : (
                <div>{lighthouseData.audits['first-contentful-paint'].description}</div>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div>
              {lighthouseData.audits ? (
              <div id="seo-metrics-box">
                <p><strong>Largest Contentful Paint: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>{lighthouseData.audits['largest-contentful-paint'].displayValue}</p>
              {lighthouseData.audits['largest-contentful-paint'].description.includes('[Learn more]') ? (
                <div id="metrics-desc-div">
                  {lighthouseData.audits['largest-contentful-paint'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['largest-contentful-paint'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </div>
              ) : (
                <div>{lighthouseData.audits['largest-contentful-paint'].description}</div>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div>
              {lighthouseData.audits && lighthouseData.audits["time-to-interactive"] ? (
              <div id="seo-metrics-box">
                <p><strong>Time to Interactive: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>{lighthouseData.audits['time-to-interactive'].displayValue}</p>
              {lighthouseData.audits['time-to-interactive'].description.includes('[Learn more]') ? (
                <div id="metrics-desc-div">
                  {lighthouseData.audits['time-to-interactive'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['time-to-interactive'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </div>
              ) : (
                <div>{lighthouseData.audits['time-to-interactive'].description}</div>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div>
              {lighthouseData.audits ? (
              <div id="seo-metrics-box">
                <p><strong>Cumulative Layout Shift: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>{lighthouseData.audits['cumulative-layout-shift'].displayValue}</p>
              {lighthouseData.audits['cumulative-layout-shift'].description.includes('[Learn more]') ? (
                <div id="metrics-desc-div">
                  {lighthouseData.audits['cumulative-layout-shift'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['cumulative-layout-shift'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </div>
              ) : (
                <div>{lighthouseData.audits['cumulative-layout-shift'].description}</div>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div>
              {lighthouseData.audits ? (
              <div id="seo-metrics-box">
                <p><strong>Total Blocking Time: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right'}}>{lighthouseData.audits['total-blocking-time'].displayValue}</p>
              {lighthouseData.audits['total-blocking-time'].description.includes('[Learn more]') ? (
                <div id="metrics-desc-div">
                  {lighthouseData.audits['total-blocking-time'].description.split('[Learn more](')[0]}
                  <a href={lighthouseData.audits['total-blocking-time'].description.split('[Learn more](')[1].split(')')[0]}>Learn more</a>
                </div>
              ) : (
                <div>{lighthouseData.audits['total-blocking-time'].description}</div>
              )}
              </div>
            ) : (
              <></>
            )}
          </div>

          
          <div id="opportunities-div">
            {lighthouseData ? (
              <>
                <h2 style={{textAlign: 'center', color: 'rgb(70, 70, 70)'}}>Suggestions</h2>
                  <div>
                    {filterOpportunities().map((opportunity, index) => (
                      <div key={index} id="opp-div-each">
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
          </div>

          {lighthouseData && lighthouseData.categories ? <button id="save-data-btn" onClick={sendDataToDatabase}> save data</button> : null}
          <SeoHistory />
          </>}
    </div>
  )
};


