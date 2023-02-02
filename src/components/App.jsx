/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useEffect } from 'react';
import { DisplaySeo } from './DisplaySeo';
import * as d3 from 'd3';
import '../App.css'
import MainUI from './MainUI'

export default function App() {

  //this is the object we will create the tree from
  const [nestedObj, setNestedObj] = useState({
    name: undefined
  })
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [domain, setDomain] = useState('');
  const [userId, setUserId] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [lighthouseData, setLighthouseData] = useState({});
  // eslint-disable-next-line no-undef

  function treeGenerator(data) {

    const width = document.body.clientWidth
    const height = document.body.clientHeight

    const margin = { top: 100, right: 120, bottom: 100, left: 40 };
    const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
    const dx = 30
    const dy = width / 12
    const tree = d3.tree().nodeSize([dx, dy])

    const root = d3.hierarchy(data);

    root.x0 = dy / 6;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth) d.children = null;
    });

    const svg = d3.select(".chart")
      .attr("viewBox", [-margin.left, -margin.top, width, height])
      .style("font", "5px sans-serif")

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    var tooltip = d3.select('.tree-div')
      .append("div")
      .style("position", "absolute")
      .style('text-align', 'centre')
      .style('font-size', '1.25em')
      .style('font-family', 'sans-serif')
      .style("background-color", "lightsteelblue")
      .style("border", "solid")
      .style("border-width", '0px')
      .style("border-radius", "8px")
      .style("padding", "2px")
      .style("visibility", 'hidden')
      .style('opacity', 0)
      .attr("id", "tooltip");

    function update(source) {

      const nodes = root.descendants().reverse();
      const links = root.links();

      // tree layout
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      const transition = svg.transition()
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .style('background', 'rgb(239 238 238)');

      const node = gNode.selectAll("g")
        .data(nodes, d => d.id)
        .on('mouseover', function (event, d, i) {
          let attr = Object.keys(d.data.attributes)
          const checkedMismatch = ['elementMismatch', 'textMismatch', 'nestedElements', 'improperNesting', 'improperListNesting']
          let htmlMessage = ''
          if (attr.length === 0) htmlMessage = 'Hydrated successfully'
          else {
            attr.forEach((e) => {
              if (checkedMismatch.includes(e)) {
                htmlMessage = d.data.attributes[e]
              }
              else htmlMessage = 'Hydrated successfully'
            })
          }
          var htmlWidth = htmlMessage.length * 5

          d3.selectAll('#tooltip').transition()
            .duration(1000)
            .style('visibility', 'visible')
            .style('opacity', .9)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .style('width', `${htmlWidth}px`)
            .style('height', '28px');
          tooltip.html(htmlMessage)
        })
        .on("mouseout", function (d) {
          d3.selectAll('#tooltip').transition()
            .duration(500)
            .style("visibility", 'hidden')
            .style('opacity', 0)
        })

      const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d.data.attributes.flagged ? "red" : d._children ? "green" : "gray")
        .attr("stroke-width", 10);

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 4)
        .attr("stroke", "white");

      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
        .attr("d", d => {

          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);

  }

  //inject script to current browser, pull out nested object made from DOM tree
  async function injectFunction() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: grabTreeFromBrowser,
      world: "MAIN"
    }, async (injectionResults) => {
      const firstTree = injectionResults[0].result
      console.log(firstTree)
      const comparison = await runComparison(firstTree)
      setNestedObj(comparison)
    });
  }

  //injected function
  //creates tree from DOM
  //traverses using BFS
  //creates a deeply nested object
  function grabTreeFromBrowser() {

    const root = document.getElementById('__next') ? document.getElementById('__next') : document.getElementById('__gatsby') ? document.getElementById('__gatsby') : document.getElementById('root') ? document.getElementById('root') : document.body
    //create tree walker
    const tree = document.createTreeWalker(root)
    const node = tree.currentNode
    const nodeObj = {}




    //BFS
    const queue = [{ domNode: node, context: nodeObj }]
    while (queue.length > 0) {
      //context aka pointer to layer of object
      const { domNode, context } = queue.shift();
      context.outerHTML = domNode.outerHTML

      //add keys to object
      if (!context.attributes) context.attributes = {}
      if (!context.name) context.name = ''

      // if (domNode.onclick && domNode.onclick !== undefined && domNode.onclick !== null) {
      //   console.log(domNode.onclick)
      //   context.attributes.onclick = domNode.onclick
      // }

      //add name and text to object
      if (domNode.nodeName) context.name = domNode.nodeName
      if (domNode.nodeName === '#text' && domNode.textContent !== null && domNode.textContent !== undefined) {
        context.attributes.content = domNode.textContent
      }

      //check hydration status of memoized react fiber
      if (Object.keys(domNode).length > 0 && domNode[Object.keys(domNode)[0]]) {
        let fiber = domNode[Object.keys(domNode)[0]]
        if (fiber.memoizedState !== null && fiber.memoizedState !== undefined) {
          if (fiber.memoizedState.isDehydrated !== null && fiber.memoizedState.isDehydrated !== undefined) {
            context.attributes.hydrated = !fiber.memoizedState.isDehydrated
          }
        }
      }
      const keys = Object.keys(domNode)
      if (keys.length > 1 && keys[1].includes('__reactProps')) {
        const propKeys = Object.keys(domNode[keys[1]])
        for (let i = 0; i < propKeys.length; i++) {
          if (propKeys[i].includes('on')) {
            context.attributes[propKeys[i]] = domNode[keys[1]][propKeys[i]]
          }
        }
      }
      //check to see if react fiber has event listeners or text props
      // if (Object.keys(domNode).length > 1 && String(Object.keys(domNode)[1]).includes('__reactProps')) {
      //   let prop = domNode[Object.keys(domNode)[1]]
      //   if (prop.children !== null && prop.children !== undefined && !Array.isArray(prop.children)) {
      //     context.attributes.text = prop.children
      //   }
      //   let propChain = Object.keys(prop)
      //   console.log(propChain)
      //   if (propChain.length > 0) {
      //     for (let i = 0; i < propChain.length; i++) {
      //       if (propChain[i].slice(0, 2) === 'on') {
      //         let hydratedProp = propChain[i]
      //         // let val = prop[hydratedProp]
      //         if (prop[hydratedProp] === undefined) {
      //           context.attributes[hydratedProp] = undefined
      //         } else if (prop[hydratedProp] === null) {
      //           context.attributes[hydratedProp] = null
      //         } else {
      //           context.attributes[hydratedProp] = String(prop[hydratedProp])
      //         }
      //       }
      //     }
      //   }
      // }

      //push node onto queue with correct pointer
      if (domNode.childNodes !== null && domNode.childNodes.length > 0) {
        for (let i = 0; i < domNode.childNodes.length; i++) {
          context.children ? context.children.push({}) : context.children = [{}]
          queue.push({ domNode: domNode.childNodes[i], context: context.children[i] })
        }
      }
    }
    return nodeObj
  }

  async function runComparison(currentTree) {

    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });

    //need xmlhttp request, fetch wont work
    const xmlhttp = new XMLHttpRequest();

    //need xml to make DOM
    xmlhttp.overrideMimeType('text/xml');
    xmlhttp.open("GET", currentTab[0].url, false);
    xmlhttp.send(null);
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlhttp.responseText, 'text/html')
    console.log(doc)

    //make tree from DOM
    const root = doc.getElementById('__next') ? doc.getElementById('__next') : doc.getElementById('__gatsby') ? doc.getElementById('__gatsby') : doc.getElementById('root') ? doc.getElementById('root') : doc.body
    const tree = doc.createTreeWalker(root)
    console.log(tree)

    //BFS
    const queue = [{ node: tree.currentNode, pointer: currentTree }]
    while (queue.length > 0) {

      const { node, pointer } = queue.shift();

      const nodeHTML = node.outerHTML;
      if (nodeHTML !== pointer.outerHTML) {
        // pointer.attributes.flagged = true;
        pointer.attributes.message = 'This element and all child elements underneath it were rendered from the client side. As such, they will not interfere with hydration.'
        continue
      }
      if (pointer.name === undefined || pointer.name === null) console.log('its not here')

      if (node.nodeName !== pointer.name) {
        pointer.attributes.flagged = true
        pointer.attributes.elementMismatch = 'HTML element is different from the previous render.'
      }

      //check content of current node, compare to browser tree
      if (node.textContent) {
        if (pointer) {
          if (pointer.attributes.content) {
            if (pointer.attributes.content !== node.textContent) {
              pointer.attributes.flagged = true
              pointer.attributes.textMismatch = `This node rendered ${pointer.attributes.content} first and then ${node.textContent} the second time.`
            }
          }
        }
      }



      //create offset if fetched DOM has more elements
      let offset = 0
      const childList = node.childNodes

      for (let i = 0; i < childList.length; i++) {
        const currentElementName = childList[i].nodeName
        const parentElementName = node.nodeName
        if (childList[i].nodeName !== pointer.children[i - offset].name) {
          offset++
          continue
        } else {
          if (parentElementName === currentElementName || parentElementName === pointer.children[i - offset].name) {
            if (parentElementName !== 'DIV') {
              pointer.attributes.flagged = true
              pointer.attributes.nestedElements = 'make sure you dont have nested HTML elements'
            }
          }
          if (parentElementName.toLowerCase() === 'a') {
            if (currentElementName.toLowerCase() === 'button') {
              pointer.attributes.flagged = true
              pointer.attributes.improperNesting = 'avoid nesting button inside a element'
            }
          }
          if (parentElementName.toLowerCase() === 'ul' || parentElementName.toLowerCase() === 'ol') {
            if (currentElementName !== 'li' && currentElementName !== 'script' && currentElementName !== 'template') {
              pointer.attributes.flagged = true
              pointer.attributes.improperListNesting = 'avoid nesting anything other than li, script, or template in a list'
            }
          }
          queue.push({ node: childList[i], pointer: pointer.children[i - offset] })
        }
      }
    }
    console.log(currentTree)
    treeGenerator(currentTree)
    return currentTree
  };

  // useEffect(() => {
  //   const runLighthouseAndSendCookies = async (e) => {
  //     e.preventDefault();
  //     chrome.runtime.sendMessage({ message: "get_current_tab_url" }, 
  //       (response) => {
  //         if(response.error){
  //           setErrorMessage(response.error);
  //         }
  //         setUrl(response.url);
  //         setDomain(response.domain);
  //         setUserId(response.userId);
  //         console.log(domain, userId);
  //         console.log(response.domain, response.userId);
  //       });
  //   };
  //   runLighthouseAndSendCookies();
  // }, []); // <-- This will make the effect only run once on mount
  // useEffect(() => {
  //   if (domain === '' || userId === '') {
  //     return;
  //   }
  //   const runLighthouse = async () => {
  //     const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
  //     try {
  //       let parsed = ''
  //       const response = await fetch('http://localhost:8080/api/lighthouse', {
  //         method: 'POST',
  //         body: JSON.stringify({ url: currentTab[0].url }),
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //       if (!response.ok){
  //         throw new Error(response.statusText)
  //       }
  //       const report = await response.json();
  //       parsed = JSON.parse(report.report);
  //       console.log(parsed);
  //       console.log(parsed.categories.seo.score);
  //       try {
  //         console.log('userId> '+userId, 'domain> '+domain, )
  //         const response2 = await fetch('http://localhost:8080/api/seoItems', {
  //           method: "POST",
  //           body: JSON.stringify({
  //             userId: userId, domain: response.url, 
  //             score: parsed.categories.seo.score, audits: parsed.audits, 
  //             categoryGroups: parsed.categoryGroups 
  //           }),
  //           headers: {
  //             "content-Type": "application/json"
  //           }
  //         });
  //         console.log(response2)
  //         if (!response2.ok){
  //           throw new Error(response2.statusText)
  //         }
  //         const report2 = await response2.json();
  //         console.log(report2);
  //       } catch (err) {
  //         console.log(err)
  //       }
  //     } catch(err) {
  //       console.log(err)
  //     }
  //   };
  //   runLighthouse();
  // })
  // useEffect(() => {
  //   const runLighthouseAndSendCookies = async (e) => {
  //     e.preventDefault();
  //     chrome.runtime.sendMessage({ message: "get_current_tab_url" }, 
  //       (response) => {
  //         if(response.error){
  //           setErrorMessage(response.error);
  //         }

  //         setUrl(response.url);
  //         setDomain(response.domain);
  //         setUserId(response.userId);
  //         console.log(response.domain, response.userId);
  //       });

  //     const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
  //     try {
  //       let parsed = ''
  //       const response = await fetch('http://localhost:8080/api/lighthouse', {
  //         method: 'POST',
  //         body: JSON.stringify({ url: currentTab[0].url }),
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //       if (!response.ok){
  //         throw new Error(response.statusText)
  //       }
  //       const report = await response.json();
  //       parsed = JSON.parse(report.report);
  //       console.log(parsed);
  //       console.log(parsed.categories.seo.score);
  //       try {
  //         console.log('userId> '+userId, 'domain> '+domain);
  //         const response2 = await fetch('http://localhost:8080/api/seoItems', {
  //           method: "POST",
  //           body: JSON.stringify({
  //           userId: userId, domain: response.url, 
  //           score: parsed.categories.seo.score, audits: parsed.audits, 
  //           categoryGroups: parsed.categoryGroups 
  //           }),
  //           headers: {
  //             "content-Type": "application/json"
  //           }
  //         });
  //         console.log(response2)
  //         if (!response2.ok){
  //           throw new Error(response2.statusText)
  //         }
  //         const report2 = await response2.json();
  //         console.log(report2);
  //       } catch (err) {
  //         console.log(err)
  //       }
  //     } catch(err) {
  //       console.log(err)
  //     }
  //   };
  //   runLighthouseAndSendCookies();
  // }, [domain, userId]);

  // const runLighthouseAndSendCookies = async (e) => {
  //   e.preventDefault();
  //   chrome.runtime.sendMessage({ message: "get_current_tab_url" }, 
  //     async (response) => {
  //       if(response.error){
  //         setErrorMessage(response.error);
  //       }
  //       setUrl(response.url);
  //       setDomain(response.domain);
  //       setUserId(response.userId);
  //       await runLighthouse(response.url, userId, domain)
  //     });
  // };

  // const runLighthouse = async(url, userId, domain) => {
  //   const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
  //   try {
  //     let parsed = ''
  //     const response = await fetch('http://localhost:8080/api/lighthouse', {
  //       method: 'POST',
  //       body: JSON.stringify({ url: currentTab[0].url }),
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     if (!response.ok){
  //       throw new Error(response.statusText)
  //     }
  //     const report = await response.json();
  //     parsed = JSON.parse(report.report);
  //     console.log(parsed);
  //     console.log(parsed.categories.seo.score);
  //     try {
  //       console.log('userId> '+userId, 'domain> '+domain, )
  //       const response2 = await fetch('http://localhost:8080/api/seoItems', {
  //         method: "POST",
  //         body: JSON.stringify({
  //         userId: userId, domain: response.url, 
  //         score: parsed.categories.seo.score, audits: parsed.audits, 
  //         categoryGroups: parsed.categoryGroups 
  //         }),
  //         headers: {
  //           "content-Type": "application/json"
  //         }
  //       });
  //       console.log(response2)
  //       if (!response2.ok){
  //         throw new Error(response2.statusText)
  //       }
  //       const report2 = await response2.json();
  //       console.log(report2);
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   } catch(err) {
  //     console.log(err)
  //   }
  // }

  const runLighthouseAndSendCookies = async (e) => {
    // e.preventDefault();
    chrome.runtime.sendMessage({ message: "get_current_tab_url" },
      async (response) => {
        if (response.error) {
          setErrorMessage(response.error);
        }

        await setUrl(response.url);
        await setDomain(response.domain);
        await setUserId(response.userId);
        console.log(domain, userId);
        console.log(response.domain, response.userId);
      });

    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
      let parsed = ''
      const response = await fetch('http://localhost:8080/api/lighthouse', {
        method: 'POST',
        body: JSON.stringify({ url: currentTab[0].url }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const report = await response.json();
      parsed = JSON.parse(report.report);
      setLighthouseData(report.report);
      console.log(parsed);
      console.log(parsed.categories.seo.score);
      try {
        console.log('userId> ' + userId, 'domain> ' + domain,)
        const response2 = await fetch('http://localhost:8080/api/seoItems', {
          method: "POST",
          body: JSON.stringify({
            userId: userId, domain: response.domain,
            score: parsed.categories.seo.score, audits: parsed.audits,
            categoryGroups: parsed.categoryGroups
          }),
          headers: {
            "content-Type": "application/json"
          }
        });
        console.log(response2)
        if (!response2.ok) {
          throw new Error(response2.statusText)
        }
        const report2 = await response2.json();
        console.log('report2>' + report2);
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  };



  useEffect(() => {
    if (!buttonClicked) {
      return;
    }
    runLighthouseAndSendCookies();
  }, [buttonClicked, domain, userId]);

  // const handlelighthouseClick = () => {
  //   setButtonClicked(true);
  // };

  return (
    <MainUI performance={runLighthouseAndSendCookies} injector={injectFunction} />
  );
};


{/* <div className="App" style={{ height: '2000px', width: '2000px' }}>
      <button onClick={injectFunction}>Click me</button>
      <button onClick={handlelighthouseClick}> Run lighthouse test</button> */}

{/* <button onClick={grabCookiesFromBackground}> click to set cookies</button> */ }

// <p>{url}</p>
// {errorMessage && <div className='errorMessage'>"Error: " {errorMessage}</div>}

{/* {lighthouseData && < DisplaySeo lighthouseData = {lighthouseData}/>} */ }

    //   <div id="treeWrapper" style={{ height: '100px', width: '100px' }}>
    //     {nestedObj.name ? 'works' : ''}
    //   </div>
    //   <div><svg class='chart'></svg></div>
    // </div>