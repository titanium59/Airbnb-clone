import { useState } from "react";
import axios from "axios";

export default function PhotosUploader({ addedPhotos, onChange }) {
    const [photoLink, setPhotoLink] = useState('');


    async function addPhotoByLink(evt) {
        evt.preventDefault();
        const { data: filenames } = await axios.post('/upload-by-link', { link: photoLink })
        onChange(prev => {
            return [...prev, ...filenames]
        })
        setPhotoLink('');
    }

    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(response => {
            const { data: filename } = response;
            onChange(prev => {
                return [...prev, ...filename]
            })
        })
    }
    return (
        <>
            <div className="flex gap-2">
                <input type="text" placeholder="Add using link" value={photoLink} onChange={ev => setPhotoLink(ev.target.value)}
                />
                <button className="bg-gray-200 px-4 rounded-2xl" onClick={addPhotoByLink} >Add&nbsp;photo</button>
            </div>



            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {addedPhotos.length > 0 && addedPhotos.map(link => (
                    <div className="h-32 flex" key={link}>

                        <img className="rounded-2xl w-full object-cover" src={"http://localhost:4000/uploads/" + link} alt="" />
                    </div>

                ))}
                <label className="border h-32 cursor-pointer flex items-center justify-center bg-transparent rounded-2xl  text-2xl text-gray-600">
                    <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                    +</label>

            </div>
        </>
    )
}