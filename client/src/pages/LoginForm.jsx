import axios from "axios";
import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function loginUser(e) {
        e.preventDefault();
        try {
            await axios.post('/login', { email, password }, { withCredentials: true });
            alert("successful")
            setRedirect(true);
        } catch {
            alert("Something went wrong");
        }

    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4 d">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={loginUser}>
                    <input type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input type="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="primary">Login</button>
                </form>
                <div className="text-center py-2 text-gray-500">
                    Don't have an account yet?
                    <Link to={'/register'} className="underline text-black">Register Now</Link>
                </div>
            </div>

        </div>
    )
}