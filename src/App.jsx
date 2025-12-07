import { Route,Routes } from 'react-router-dom'
import HomePage from './assets/pages/Home/Home'
import MailPage from './assets/pages/Mail/Mail'
import LoginPage from './assets/pages/Login/Login'

import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/mail' element={<MailPage/>}/>
        <Route path='/login' element={<LoginPage/>}></Route>
      </Routes>
    </>
  )
}

export default App
