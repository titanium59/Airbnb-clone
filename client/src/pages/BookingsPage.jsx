import { useEffect, useState } from 'react'
import AccountNavigation from '../AccountNavigation'
import axios from 'axios';
import { differenceInCalendarDays, format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function BookingsPage() {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('/bookings').then(response => {
            setBookings(response.data);
        })
    }, [])
    return (
        <div>
            <AccountNavigation />
            <div>
                {bookings?.length > 0 && bookings.map(booking => (
                    <Link to={`/account/bookings/${booking._id}`} className='flex gap-4 bg-gray-200 overflow-hidden rounded-2xl'>
                        <div className="w-48">
                            <img src={`http://localhost:4000/uploads/${booking.place.photos[0]}`} />
                        </div>
                        <div className='py-3 pr-3 grow'>
                            <h2 className='text-xl'>{booking.place.title}</h2>
                            <div className='border-t border-gray-300 mt-2 py-2'>
                                {format(new Date(booking.checkIn), 'dd-MM-yyyy')} &rarr; {format(new Date(booking.checkOut), 'dd-MM-yyyy')}
                            </div>
                            <div className='text-xl'>
                                {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights | Total price : ₹
                                {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn)) * booking.place.price}
                            </div>

                        </div>



                    </Link>
                ))}
            </div>
        </div>
    )
}