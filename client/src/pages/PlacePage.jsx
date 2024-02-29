import { useParams } from "react-router"

export default function PlacePage() {
    const { id } = useParams();
    return (
        <div> place page : {id}</div>
    )
}