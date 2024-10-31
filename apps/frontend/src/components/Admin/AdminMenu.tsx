import {Link} from "react-router-dom";

export const AdminMenu = () => {
    return (
        <div className={"w-auto h-auto absolute left-4 bottom-4 z-50 bg-red-500 p-1 rounded-lg flex"}>
            <ul className={"flex space-x-4"}>
                <li><Link to={"/organisation"}>Organisations</Link></li>
                <li><Link to={"/admin"}>admin</Link></li>
            </ul>
        </div>
    )
}
