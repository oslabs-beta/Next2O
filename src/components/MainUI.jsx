import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import logoFill from '../assets/n2o-logo-fill.png';

const MainUI = (props) => {
  console.log(props)
  const runTreeVisualizer = () => {
    console.log('click')
    props.injector()
  }
  const runPerformanceAnalysis = () => {
    props.performance()
    console.log('performance')
  }

  return (
    <div className='div-container'>
      <div className='div-wrapper'>
        <div className='div-header'>
            <div className='div-img-container'>
              <img id='logo' src={logoFill} alt="Logo" />
            </div>
            <div className='div-icon'>
              <CloseIcon fontSize='small' className='CloseIcon'/>
            </div>
        </div>

        <div className='div-body'>
        </div>

        <div className='div-footer'>
          <ul className='ul-bot-nav'>

            <li>
              <div className='bot-tab-wrapper'>
                <div className='bot-tab-pop'>
                  <div className='bot-tab-pop-content'>Debugging</div>
                </div>
                <button className='bot-tab' onClick={runTreeVisualizer}><BugReportIcon /></button>
              </div>
            </li>

            <li>
              <div className='bot-tab-wrapper'>
                <div className='bot-tab-pop'>
                  <div className='bot-tab-pop-content'>Performance</div>
                </div>
                <button className='bot-tab' onClick={runPerformanceAnalysis}><ElectricBoltIcon /></button>
              </div>
            </li>

            {/* <li>
              <div className='bot-tab-wrapper'>
                <div className='bot-tab-pop'>
                  <div className='bot-tab-pop-content'>Testing</div>
                </div>
                <div className='bot-tab'>SEO</div>
              </div>
            </li> */}
          
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MainUI