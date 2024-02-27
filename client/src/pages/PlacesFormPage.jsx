import { useState } from "react";
import Perks from "./Perks";
import PhotosUploader from "./PhotosUploader";
import axios from "axios";
import AccountNavigation from "../AccountNavigation";
import { Navigate } from "react-router";

export default function PlacesFormPage() {

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkInTime, setCheckInTime] = useState(1);
    const [checkOutTime, setCheckOutTime] = useState(1);
    const [guests, setGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);

    function inputHeader(text) {
        return (
            <h2 className="text-xl mt-4">{text}</h2>
        )
    }

    async function addNewPlace(evt) {
        evt.preventDefault();
        await axios.post('/places', {
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkInTime, checkOutTime, guests
        });
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }

    return (
        <div>
            <AccountNavigation />
            <form onSubmit={addNewPlace}>

                {inputHeader("Title")}
                <input type="text" placeholder="title, for example: My lovely apt" value={title} onChange={ev => setTitle(ev.target.value)} />


                {inputHeader("Address")}
                <input type="text" placeholder="address"
                    value={address} onChange={ev => setAddress(ev.target.value)}
                />


                {inputHeader("Photos")}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />


                {inputHeader("Description")}
                <textarea rows={5} value={description} onChange={ev => setDescription(ev.target.value)} />


                {inputHeader("Perks")}
                <div className="grid mt-2 gap-1 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                {inputHeader("Extra info")}
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                <h2 className="text-xl mt-4">Check in & out times , max guests</h2>
                <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in</h3>
                        <input
                            type="number"
                            placeholder="14"
                            value={checkInTime} onChange={ev => setCheckInTime(ev.target.value)}
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out</h3>
                        <input
                            type="number"
                            placeholder="14"
                            value={checkOutTime} onChange={ev => setCheckOutTime(ev.target.value)}
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max guests</h3>
                        <input
                            type="number"
                            placeholder="5"
                            value={guests} onChange={ev => setGuests(ev.target.value)}
                        />
                    </div>
                </div>
                <button className="primary my-4">Save</button>
            </form>

        </div>
    )
}