import { fontWeight } from "@mui/system";
import React, {useState , useEffect} from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import 'react-circular-progressbar/dist/styles.css';

export default function DisplaySeo (props) {
  // const [url, setUrl] = useState('')
  const [lighthouseData, setLighthouseData] = useState({});
  const [debounce, setDebounce] = useState(false);
  const [speedIndexColor, setSpeedIndexColor] = useState('');
  const [fcpColor, setFcpColor] = useState('');
  const [lcpColor, setLcpColor] = useState('');
  const [ttiColor, setTtiColor] = useState('');
  const [tbtColor, setTbtColor] = useState('');
  const [clsColor, setClsColor] = useState('');
  const [chartData, setChartData] = useState([]);

 
  const runLighthouse = async (e) => {
    if (debounce === true) return
    setDebounce(true)
    try {
        e.preventDefault();
        const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
        // setUrl(currentTab);
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
        setLighthouseData(parsed);
        setDebounce(false);
        console.log(parsed);
    } catch(err) {
      console.log(err)
    }
  };

  const sendDataToDatabase = async (e) => {

    e.preventDefault();
    try {
      
      const response = await fetch('http://localhost:8080/api/seoItems', {
        method: "POST",
        body: JSON.stringify({
          userId: props.info.id, 
          url: lighthouseData.requestedUrl, 
          audits: lighthouseData.audits, 
          seoScore: lighthouseData.categories.seo.score, 
          performanceScore: lighthouseData.categories.performance.score,
          accessibilityScore: lighthouseData.categories.accessibility.score
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
  const filterSeoPerformanceAndAccessibilityScore = async () => {
    try {
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
        })
        if (!response.ok){
          throw new Error(response.statusText)
        };
        const data = await response.json();
        console.log(data)
        setChartData(data)
    } catch(err) {
      console.log(err)
    }
  };
 useEffect(() => {
    filterSeoPerformanceAndAccessibilityScore()
 }, []);
 console.log(chartData)
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

  //  const thinStyle = {
  //   textColor: "#3F51B5",
  //   pathColor: "#3F51B5",
  //   textSize: "24px",
  // }
  

  useEffect(() => {
    if (lighthouseData.audits && lighthouseData.audits['speed-index'].displayValue) {
      let speedIndex = lighthouseData.audits['speed-index'].displayValue;
      speedIndex = parseFloat(speedIndex.split('s')[0]);
      
      if (speedIndex >= 0 && speedIndex <= 3.4) {
        setSpeedIndexColor('green');
      } else if (speedIndex > 3.4 && speedIndex <= 5.8) {
        setSpeedIndexColor('orange');
      } else if (speedIndex > 5.8) {
        setSpeedIndexColor('red');
      }
    }
  }, [lighthouseData.audits]);

  useEffect(() => {
    if (lighthouseData.audits && lighthouseData.audits['first-contentful-paint'].displayValue) {
      let fcp = lighthouseData.audits['first-contentful-paint'].displayValue;
      fcp = parseFloat(fcp.split('s')[0]);
      if (fcp >= 0 && fcp <= 1.8) {
        setFcpColor('green');
      } else if (fcp > 1.8 && fcp <= 3) {
        setFcpColor('orange');
      } else if (fcp > 3) {
        setFcpColor('red');
      }
    }
  }, [lighthouseData.audits]);

  useEffect(() => {
    if (lighthouseData.audits && lighthouseData.audits['largest-contentful-paint'].displayValue) {
      let lcp = lighthouseData.audits['largest-contentful-paint'].displayValue;
      lcp = parseFloat(lcp.split('s')[0]);
      if (lcp >= 0 && lcp <= 2.5) {
        setLcpColor('green');
      } else if (lcp > 2.5 && lcp <= 4) {
        setLcpColor('orange');
      } else if (lcp > 4) {
        setLcpColor('red');
      }
    }
  }, [lighthouseData.audits]);
  
  useEffect(() => {
    if (lighthouseData.audits && lighthouseData.audits['time-to-interactive']) {
      let tti = lighthouseData.audits['time-to-interactive'].displayValue;
      tti = parseFloat(tti.split('s')[0]);
      if (tti >= 0 && tti <= 3.8) {
        setTtiColor('green');
      } else if (tti > 3.8 && tti <= 7.3) {
        setTtiColor('orange');
      } else if (tti > 7.3) {
        setTtiColor('red');
      }
    }
  }, [lighthouseData.audits]);

  useEffect(() => {
    if (lighthouseData.audits && lighthouseData.audits['total-blocking-time'].displayValue) {
      let tbt = lighthouseData.audits['total-blocking-time'].displayValue;
      tbt = parseFloat(tbt.split('ms')[0]);
      if (tbt >= 0 && tbt <= 200) {
        setTbtColor('green');
      } else if (tbt > 200 && tbt <= 600) {
        setTbtColor('orange');
      } else if (tbt > 600) {
        setTbtColor('red');
      }
    }
  }, [lighthouseData.audits]);

  useEffect(() => {
    if (lighthouseData.audits && lighthouseData.audits['cumulative-layout-shift'].displayValue) {
      let cls = lighthouseData.audits['cumulative-layout-shift'].displayValue;
      cls = parseFloat(cls);
      if (cls >= 0 && cls <= 0.1) {
        setClsColor('green');
      } else if (cls > 0.1 && cls <= 0.25) {
        setClsColor('orange');
      } else if (cls > 0.25) {
        setClsColor('red');
      }
    }
  }, [lighthouseData.audits]);

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

        { lighthouseData.categories ?<div id="seo-val-and-title">
        <div id="seo-val-wrap">
             <CircularProgressbar value={Math.round(lighthouseData.categories.accessibility.score * 100)} text={`${Math.round(lighthouseData.categories.accessibility.score * 100)}`} counterClockwise
            background backgroundPadding={6}
            styles={buildStyles(filledStyle)} /> 
          </div>
          <p style={{ padding: '5px' }}>Accessibility</p> 
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
            
          <div>
              {lighthouseData.audits && lighthouseData.audits['speed-index'].displayValue ? (
              <div id="seo-metrics-box">
                <p><strong>Speed Index: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right', color: speedIndexColor}}>{lighthouseData.audits['speed-index'].displayValue}</p>
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
              {lighthouseData.audits && lighthouseData.audits['first-contentful-paint'].displayValue ?(
              <div id="seo-metrics-box">
                <p><strong>First Contentful Paint: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right', color: fcpColor}}>{lighthouseData.audits['first-contentful-paint'].displayValue}</p>
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
              {lighthouseData.audits && lighthouseData.audits['largest-contentful-paint'].displayValue ? (
              <div id="seo-metrics-box">
                <p><strong>Largest Contentful Paint: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right', color: lcpColor}}>{lighthouseData.audits['largest-contentful-paint'].displayValue}</p>
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
               <p id="metrics-value" style={{display: 'inline-block', float: 'right', color: ttiColor}}>{lighthouseData.audits['time-to-interactive'].displayValue}</p>
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
              {lighthouseData.audits && lighthouseData.audits['cumulative-layout-shift'].displayValue ? (
              <div id="seo-metrics-box">
                <p><strong>Cumulative Layout Shift: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right', color: clsColor}}>{lighthouseData.audits['cumulative-layout-shift'].displayValue}</p>
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
              {lighthouseData.audits && lighthouseData.audits['total-blocking-time'].displayValue ? (
              <div id="seo-metrics-box">
                <p><strong>Total Blocking Time: </strong></p>
               <p id="metrics-value" style={{display: 'inline-block', float: 'right', color: tbtColor}}>{lighthouseData.audits['total-blocking-time'].displayValue}</p>
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
          <div>
            <h3>History</h3>
            <LineChart width={300} height={150} data={chartData.filterSeo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis/>
            <Tooltip />
            <Legend />
            {chartData.filterSeo.some(d => d.seo_score !== null) && (
              <Line type="monotone" dataKey="seo_score" stroke="#8884d8" />
            )}
            {chartData.filterSeo.some(d => d.performance_score !== null) && (
              <Line type="monotone" dataKey="performance_score" stroke="#82ca9d" />
            )}
            {chartData.filterSeo.some(d => d.accessibility_score !== null) && (
              <Line type="monotone" dataKey="accessibility_score" stroke="#ffc658" />
            )}
            </LineChart>
          </div>
          </>}
    </div>
  )
};


