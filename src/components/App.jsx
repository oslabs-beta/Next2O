/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useEffect } from 'react';
import * as d3 from 'd3';
import '../App.css';
import MainUI from './MainUI'

export default function App() {

  //this is the object we will create the tree from
  const [nestedObj, setNestedObj] = useState({
    name: undefined
  });
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    chrome.identity.getProfileUserInfo({ 'accountStatus': 'ANY' }, function (info) {
      setUserInfo(info);
    });
  }, []);
  console.log(userInfo);

  const errors = []

  const [errorList, setErrorList] = useState([])
  // eslint-disable-next-line no-undef

  function treeGenerator(data) {

    function expand(d) {
      var children = (d.children) ? d.children : d._children;
      if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      if (children) children.forEach(expand);
    }

    function expandAll() {
      expand(root);
      update(root);
    }
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
      .style("font", "10px sans-serif")

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr('id', 'link-g')
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)

    const gNode = svg.append("g")
      .attr('id', 'node-g')
      .attr("pointer-events", "all")

      let transform;

  const zoom = d3.zoom().on("zoom", e => {
    gNode.attr("transform", (transform = e.transform));
    gNode.style("stroke-width", 3 / Math.sqrt(transform.k));
    gLink.attr("transform", (transform = e.transform));
    gLink.style("stroke-width", 3 / Math.sqrt(transform.k));
  });
  
    svg.call(zoom)
    .call(zoom.transform, d3.zoomIdentity)
    .on("pointermove", event => {
      const p = transform.invert(d3.pointer(event));
    })
    .node();

    var tooltip = d3.select('#tree-div')
      .append("div")
      .style("position", "absolute")
      .style('text-align', 'centre')
      .style('font-size', '1em')
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
        .on('mouseenter', function (event, d, i) {
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
            .style("left", (event.pageX - 75) + "px")
            .style("top", (event.pageY - 75) + "px")
            .style('width', `${htmlWidth - 20}px`)
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
        .attr("transform", d => `translate(${source.y0},${source.x0}) scale(1, 1)`)
        .attr("fill-opacity", 0)
        .attr('id', (d) => `${d.data.id.height}, ${d.data.id.width}`)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => { click(d) });

      nodeEnter.append("circle")
        .attr("r", 4.5)
        .attr("fill", d => d.data.attributes.flagged ? "red" : "green")
        .attr("stroke-width", 10)

      nodeEnter.append("text")
        .attr("dy", "0.5em")
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

    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }
    
    
    expandAll(root);

  }

  //inject script to current browser, pull out nested object made from DOM tree
  async function injectFunction() {
    setErrorList([])
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
    const levels = []

    //BFS
    const queue = [{ domNode: node, context: nodeObj, level: 1 }]
    while (queue.length > 0) {
      //context aka pointer to layer of object
      const { domNode, context, level } = queue.shift();
      console.log(level)
      context.innerHTML = domNode.innerHTML
      if (level > levels.length) {
        levels.push([''])
      } else {
        levels[level - 1].push('')
      }

      const height = level;
      const width = levels[level - 1].length;
      context.id = { height: height, width: width }
      context.width = levels[level - 1].length
      //add keys to object
      if (!context.attributes) context.attributes = {}
      if (!context.name) context.name = ''

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

      //push node onto queue with correct pointer
      if (domNode.childNodes !== null && domNode.childNodes.length > 0) {
        for (let i = 0; i < domNode.childNodes.length; i++) {
          context.children ? context.children.push({}) : context.children = [{}]
          queue.push({ domNode: domNode.childNodes[i], context: context.children[i], level: level + 1 })
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

      const nodeHTML = node.innerHTML;
      if (nodeHTML !== pointer.innerHTML) {
        pointer.attributes.clientSide = 'This element was rendered from the client side. It is most likely in a useEffect hook.'
        errors.push({ type: pointer.name, id: pointer.id, msg: pointer.attributes.clientSide, bgColor: 'lightblue' })
      }

      if (pointer.name === undefined || pointer.name === null) console.log('its not here')

      console.log(pointer.name, node.nodeName)
      if (node.nodeName.toLowerCase() !== pointer.name.toLowerCase()) {
        pointer.attributes.flagged = true
        pointer.attributes.elementMismatch = 'HTML element is different from the previous render.'
        errors.push({ type: pointer.name, id: pointer.id, msg: pointer.attributes.elementMismatch, bgColor: 'pink' })
      }

      //check content of current node, compare to browser tree
      if (node.textContent) {
        if (pointer) {
          if (pointer.attributes.content) {
            if (pointer.attributes.content !== node.textContent) {
              console.log('mismatch')
              pointer.attributes.flagged = true
              pointer.attributes.textMismatch = `This node rendered ${pointer.attributes.content} first and then ${node.textContent} the second time.`
              errors.push({ type: pointer.name, id: pointer.id, msg: pointer.attributes.textMismatch, bgColor: 'pink' })
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
        if (pointer.children[i - offset] === undefined) continue
        if (childList[i].nodeName !== pointer.children[i - offset].name) {
          offset++
          continue
        } else {
          if (parentElementName === currentElementName || parentElementName === pointer.children[i - offset].name) {
            if (parentElementName !== 'DIV') {
              pointer.attributes.flagged = true
              pointer.attributes.nestedElements = 'Make sure you dont have nested HTML elements'
              errors.push({ type: pointer.name, id: pointer.id, msg: pointer.attributes.nestedElements, bgColor: 'lightgreen' })
            }
          }
          if (parentElementName.toLowerCase() === 'a') {
            if (currentElementName.toLowerCase() === 'button') {
              pointer.attributes.flagged = true
              pointer.attributes.improperNesting = 'Avoid nesting < button > inside < a > element.'
              errors.push({ type: pointer.name, id: pointer.id, msg: pointer.attributes.improperNesting, bgColor: 'lightgreen' })
            }
          }
          if (parentElementName.toLowerCase() === 'ul' || parentElementName.toLowerCase() === 'ol') {
            if (currentElementName.toLowerCase() !== 'li' && currentElementName.toLowerCase() !== 'script' && currentElementName.toLowerCase() !== 'template') {
              pointer.attributes.flagged = true
              pointer.attributes.improperListNesting = 'Avoid nesting anything other than <li>, <script>, or <template> in a list.'
              errors.push({ type: pointer.name, id: pointer.id, msg: pointer.attributes.improperListNesting, bgColor: 'lightgreen' })
            }
          }
          queue.push({ node: childList[i], pointer: pointer.children[i - offset] })
        }
      }
    }
    console.log(currentTree)
    setErrorList(errors)
    treeGenerator(currentTree)
    return currentTree
  };





  return (
    <div>
      <MainUI errors={errorList} injector={injectFunction} info={userInfo} />
    </div>

  )
}