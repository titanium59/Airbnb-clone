import './App.css'
import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginForm from './pages/LoginForm'
import Layout from './Layout'
import RegisterForm from './pages/RegisterForm'
import axios from 'axios'
import { UserContextProvider } from './UserContext'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {

    return (
        <UserContextProvider>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<IndexPage />} />
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='register' element={<RegisterForm />} />
                </Route>
            </Routes>
        </UserContextProvider>
    )
}

export default App
