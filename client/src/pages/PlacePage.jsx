import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router"

export default function PlacePage() {

    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id])

    if (!place) return '';

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-black text-white min-h-screen">
                <div className="p-8 bg-background grid gap-4">
                    <div>
                        <h2 className="text-3xl">Photos of {place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                            Close photos</button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div>
                            <img className="" src={`http://localhost:4000/uploads/${photo}`} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
            <h1 className="text-3xl">{place.title}</h1>

            <a target="_blank" className="flex gap-1 my-2 font-semibold underline" href={`http://maps.google.com/?q=${place.address}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {place.address}</a>
            <div className="relative">
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                    <div>

                        <img className="aspect-square object-cover" src={`http://localhost:4000/uploads/${place.photos[0]}`} />

                    </div>
                    <div className="grid">

                        <img className="aspect-square object-cover" src={`http://localhost:4000/uploads/${place.photos[1]}`} />


                        <div className="overflow-hidden">
                            <img className="aspect-square object-cover relative top-2" src={`http://localhost:4000/uploads/${place.photos[2]}`} />
                        </div>

                    </div>

                </div>
                <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 px-4 py-2 bg-white rounded-2xl shadow shadow-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    Show More photos</button>
            </div>

            <div className="mt-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">

                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn}
                    <br />
                    Check-Out: {place.checkOut}
                    <br />
                    Max Guests: {place.maxGuests}
                </div>

                <div className="bg-white shadow p-4 rounded-2xl">
                    <div className="text-2xl text-center ">
                        Price: ₹{place.price} / per night
                    </div>
                    <div className="border rounded-2xl mt-4">
                        <div className="flex">
                            <div className="py-3 px-4 ">
                                <label> Check in : </label>
                                <input type="date" />
                            </div>
                            <div className="py-3 px-4 border-l">
                                <label> Check out : </label>
                                <input type="date" />
                            </div>
                        </div>
                        <div className="py-3 px-4 border-t">
                            <label> Number of guests </label>
                            <input type="number" value={1} />
                        </div>
                    </div>

                    <button className="mt-4 primary"> Book this place </button>
                </div>
            </div>

        </div >
    )
}