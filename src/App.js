import React, {useState} from 'react';
import './App.css';

import TabContainer from './tabContainer/TabContainer';
import {CURRENT_SPRINT_INFO} from '../services/constantData';
import {getSprint} from '../services/services';
import DashboardV2 from '../components/dashboard/DashboardV2';

function App() {

  const [sprint, setSprint] = useState(getSprint().sprintInfo || CURRENT_SPRINT_INFO);

  return(
    <div style={{"background-color": "#212529", color: "#ffffff"}}>
      <div>
        {/* <TabContainer sprint={sprint} setSprint={setSprint}/> */}
        <DashboardV2/>
      </div>
    </div>
  )
}

export default App;
