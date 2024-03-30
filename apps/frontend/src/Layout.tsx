import "../src/index.css"
import {Outlet, Link} from "react-router-dom";
import {
    ClipboardDocumentListIcon,
    Cog8ToothIcon,
    HomeIcon,
    QueueListIcon,
    Squares2X2Icon,
    UserGroupIcon
} from "@heroicons/react/16/solid";

const Layout = () => {
    return (
        <>
            <nav className="flex w-screen justify-center mt-4">
                <ul className="flex space-x-6 bg-slate-300 px-6 py-3 rounded-2xl">
                    <li className=" hover:bg-gray-500 rounded">
                        <Link to="/"><HomeIcon className="h-6 w-6 text-black"/></Link>
                    </li>
                    <li className=" hover:bg-gray-500 rounded">
                        <Link to="/items"><Squares2X2Icon className="h-6 w-6 text-black"/></Link>
                    </li>
                    <li className=" hover:bg-gray-500 rounded">
                        <Link to="/boms"><ClipboardDocumentListIcon className="h-6 w-6 text-black"/></Link>
                    </li>
                    <li className="hover:bg-gray-500 rounded">
                        <Link to="/orders"><QueueListIcon className="h-6 w-6 text-black"/></Link>

                    </li>
                    <li className="hover:bg-gray-500 rounded">
                        <Link to="/customer"><UserGroupIcon className="h-6 w-6 text-black"/></Link>

                    </li>
                    <li className="hover:bg-gray-500 rounded">
                        <Link to="/"><Cog8ToothIcon className="h-6 w-6 text-black"/></Link>

                    </li>
                </ul>
            </nav>

            <Outlet/>
        </>
    )
};

export default Layout;