import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Form from '../src/components/Form/Form'
import Login from './components/Login/Login'
import ForgotPassword from './components/ForgotPass/ForgotPassword'
import ResetPass from './components/ResetPass/ResetPass'
const App = () => {
  return (
   <div className='App'>
    <BrowserRouter>
    
      <Routes>
      <Route path='/' element={<Header />}/>
      <Route path='/register' element={<Form/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/forgotpassword' element={<ForgotPassword/>} />
      <Route path='/resetpassword' element={<ResetPass/>}/>
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
