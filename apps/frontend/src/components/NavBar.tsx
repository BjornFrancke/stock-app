import {Link} from "react-router-dom";
import {
    ClipboardDocumentListIcon,
    HomeIcon,
    QueueListIcon,
    Squares2X2Icon,
    UserGroupIcon,
    UserIcon, WrenchScrewdriverIcon
} from "@heroicons/react/16/solid";
import {Dropdown, Menu, MenuButton, MenuItem} from "@mui/joy";

export function NavBar() {


    return <nav className="flex w-screen mx-auto justify-center space-x-64  shadow py-3">
        <Link to="/">
            <div className={"bg-[#50A6A1] flex space-x-1 w-fit px-3 my-auto py-2 rounded-2xl"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="27px" height="27" viewBox="0 0 27 27">
                    <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10 15v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2m6-10v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2m6 10v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2M6 16v-3m6-7V3m6 13v-3"></path>
                </svg>
                <h1 className={"text-white my-auto select-none"}>Stock-app</h1>

            </div>
        </Link>

        <div className={"flex"}>
            <ul className="flex space-x-6 px-6 py-3 rounded-2xl h-12">
                <li className=" hover:bg-gray-500 rounded">
                    <Link to="/"><HomeIcon className="h-6 w-6 text-black"/></Link>
                </li>
                <li className=" hover:bg-gray-500 rounded">
                    <Link to="/items"><Squares2X2Icon className="h-6 w-6 text-black"/></Link>
                </li>
                <li className=" hover:bg-gray-500 rounded">
                    <Link to="/boms"><ClipboardDocumentListIcon className="h-6 w-6 text-black"/></Link>
                </li>
                <li>
                    <Link to="/manufacturing"><WrenchScrewdriverIcon className={"h-6 w-6 text-black"}/></Link>
                </li>
                <li className="hover:bg-gray-500 rounded">
                    <Link to="/orders"><QueueListIcon className="h-6 w-6 text-black"/></Link>

                </li>
                <li className="hover:bg-gray-500 rounded">
                    <Link to="/customer"><UserGroupIcon className="h-6 w-6 text-black"/></Link>

                </li>

            </ul>
        </div>
        <div className={" my-auto"}>
            <Dropdown

            >
                <MenuButton variant={"plain"}><UserIcon className=" h-6 w-6 text-black"/></MenuButton>

                {localStorage.getItem("token") ? (
                    <Menu>
                        <Link to="/profile"><MenuItem>Profile</MenuItem></Link>
                        <Link to="/settings"><MenuItem>
                            Language settings
                        </MenuItem></Link>
                       <Link to="/logout"><MenuItem>Log out</MenuItem></Link>
                    </Menu>


                ) : (
                    <Menu>
                        <Link to="/login"><MenuItem>Login</MenuItem></Link>
                    </Menu>)}
            </Dropdown>
        </div>
    </nav>;
}