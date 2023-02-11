# Next₂O

## Background

Server-side rendering frameworks built on React.js can create hydration errors that are often difficult to debug. Hydration errors can slow development time and slow website performance. 

React offers hydration error warnings that lack specificity, with an additional option to suppress hydration errors, although that doesn’t solve the problem and applications pushed to production with errors can experience performance erosion.

## How It Works

Download the Next2O extension from the Chrome store
Make sure you are on the tab where you have your application open (the one you like to debug hydration errors)
Click on the Next2O extension to open
Click the 'Debugging' tab to check for errors

<img width="974" alt="Screenshot 2023-02-11 at 11 31 56 AM" src="https://user-images.githubusercontent.com/90646236/218277799-24ffa88a-48c4-419f-9cdd-432a80d94dea.png">

If there are DOM nodes with hydration errors due to SSR mismatch, they'll appear in red. Description of the error(s) is listed below the DOM Tree Visualizer
Go to the 'Performance' tab to run Lighthouse for Performance metrics. This displays the SEO, Performance and Accessibility scores.
Click on ‘Save Data’ to store your performance data for Analysis

<img width="958" alt="Screenshot 2023-02-11 at 11 32 41 AM" src="https://user-images.githubusercontent.com/90646236/218277814-752fa3d4-7c1b-4ae5-b7fd-60f102606385.png">

Detailed description for each metric from the lighthouse audit is displayed for quick overview and understanding.

## Contribute

If you have any issues using our debugging tool, please submit an issue on GitHub. You're welcome to fork our repo and test changes yourself, but we ask that contributors make an official pull request for any features they'd like to add, or bug fixes.

### Website

next2o.org
