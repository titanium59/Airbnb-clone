import { useState, useContext } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import axios from "axios";



export default function AccountPage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile'
    }

    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);

    }

    if (!ready) {
        return 'Loading...';
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }



    function linkClasses(type = null) {
        let classes = 'inline-flex gap-1 py-2 px-6';
        if (type === subpage) {
            classes += ' bg-primary text-white rounded-full'
        }
        return classes;
    }

    if (redirect) {
        return (
            <Navigate to={redirect} />
        )
    }

    return (
        <div>
            <nav className="w-full flex justify-center mt-8 mb-6 gap-2">
                <Link className={linkClasses('profile')} to={'/account'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                    My Account</Link>
                <Link className={linkClasses('bookings')} to={'/account/bookings'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>

                    My Bookings</Link>
                <Link className={linkClasses('places')} to={'/account/places'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>

                    My Accomodations</Link>
            </nav>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})
                    <br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage == 'places' && (<PlacesPage />)}
        </div>
    )
}