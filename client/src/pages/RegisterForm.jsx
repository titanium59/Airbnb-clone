import { useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios'

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function registerUser(ev) {
        ev.preventDefault();
        axios.get('http://localhost:4000/test');
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4 d">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={evt => setName(evt.target.value)
                        } />
                    <input type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={evt => setEmail(evt.target.value)
                        } />
                    <input type="password"
                        placeholder="password"
                        value={password}
                        onChange={evt => setPassword(evt.target.value)
                        } />
                    <button className="primary">Register</button>
                </form>
                <div className="text-center py-2 text-gray-500">
                    Already a member?
                    <Link to={'/login'} className="underline text-black">Login</Link>
                </div>
            </div>

        </div>
    )
}