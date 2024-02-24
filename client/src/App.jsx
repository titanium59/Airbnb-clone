import './App.css'
import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginForm from './pages/LoginForm'
import Layout from './Layout'
import RegisterForm from './pages/RegisterForm'

function App() {

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<IndexPage />} />
                <Route path='/login' element={<LoginForm />} />
                <Route path='register' element={<RegisterForm />} />
            </Route>
        </Routes>
    )
}

export default App
