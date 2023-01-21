/* eslint-disable no-undef */
import React, { useState } from 'react';

export default function App () {
  
  //this is the object we will create the tree from
  const [nestedObj, setNestedObj] = useState({
    name: undefined
  })

  // eslint-disable-next-line no-undef

  //inject script to current browser, pull out nested object made from DOM tree
  async function injectFunction() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
      target: {tabId: tab.id, allFrames: true},
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
    const queue = [{domNode: node, context: nodeObj}]
    while (queue.length > 0) {
      //context aka pointer to layer of object
      const {domNode, context} = queue.shift();

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
          queue.push({domNode: domNode.childNodes[i], context: context.children[i]})
        }
      }
    }
    return nodeObj
  }

  async function runComparison(currentTree) {
    
    const currentTab = await chrome.tabs.query({active: true, currentWindow: true});

    //need xmlhttp request, fetch wont work
    const xmlhttp = new XMLHttpRequest();

    //need xml to make DOM
    xmlhttp.overrideMimeType('text/xml');
    xmlhttp.open("GET", currentTab[0].url, false);
    xmlhttp.send(null);
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlhttp.responseText, 'text/html')
    console.log(doc.body)

    //make tree from DOM
    const root = document.getElementById('__next') ? document.getElementById('__next') : document.getElementById('__gatsby') ? document.getElementById('__gatsby') : document.getElementById('root') ? document.getElementById('root') : document.body
    const tree = doc.createTreeWalker(root)
    // const serializer = new XMLSerializer()
    // const xmlNode = serializer.serializeToString(root)  
    // const newNode = parser.parseFromString(xmlNode, 'text/xml')
    // const newRoot = newNode.getElementById('__next')
    // const newTree = document.createTreeWalker(newRoot)
    // console.log(newTree)

    
    //BFS
    const queue = [{node: tree.currentNode, pointer: currentTree}]
    while (queue.length > 0) {

      const {node, pointer} = queue.shift();

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
          console.log(childList[i])
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
          queue.push({node: childList[i], pointer: pointer.children[i - offset]})
        }
      }
    }
    console.log(currentTree)
    return currentTree
  };
  
  const setCookies = async () => {
    try {
      const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
      chrome.cookies.set({
        url: currentTab[0].url,
        name: 'userId',
        value: userId
      });
      const response = await fetch('http://localhost:8080/setCookies', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch(err) {
      console.log(err);
    }
  };

  const runLighthouse = async(e) => {
    e.preventDefault();
    const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
    try {
      const response = await fetch('http://localhost:8080/api/lighthouse', {
        method: 'POST',
        body: JSON.stringify({ url: currentTab[0].url }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const report = await response.json();
      const parsed = JSON.parse(report.report)
      console.log(parsed)
      console.log(parsed.categories.seo.score)
    } catch (err) {
      console.log(err)
    }

  };
  
  return (
    <div className="App" style={{height: '2000px', width: '2000px'}}>
      <button onClick={injectFunction}>Click me</button>
      <button onClick={runLighthouse}> Run lighthouse test</button>
      <div id="treeWrapper" style={{height: '1000px', width: '1000px'}}>
        {nestedObj.name ? 'works' : ''}
      </div>
    </div>
  );
}
