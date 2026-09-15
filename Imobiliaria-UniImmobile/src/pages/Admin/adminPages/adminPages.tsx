import { DoorOpen, House, User } from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavBar } from "../../../components/NavBar";
import { UserRolesEnum } from "../../../models/types/userRolesEnum";
import { UserServices } from "../../../services/user-services";
import { ImmobileList } from "./immobiles/ImmobilesList/Immobiles";
import { UsersList } from "./users/UsersList/Users";

const screensEnum = {
    immobileScreen: "immobileScreen",
    usersScreen: "usersScreen"
}
type ScreensEnum = keyof typeof screensEnum;

export function AdminPages() {
    const navigator = useNavigate();

    const [activeScreen, setActiveScreen] = useState<ScreensEnum>("usersScreen")

    const [userIsAdmin, setUserIsAdmin] = useState(true);
    const service = new UserServices();

    const checkUserIsAdmin = async () => {
        const user = await service.findUser(localStorage.getItem("userId") ?? "")

        if (user) {
            setUserIsAdmin(user.role == UserRolesEnum.ADMIN)
        } else {
            localStorage.removeItem("token")
            navigator("/admin")
        }
    }
    useEffect(() => {
        checkUserIsAdmin()
    }, [])

    const navItemClass = (isActive: boolean) =>
        `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive
            ? "bg-(--primary-color) text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <div className="h-screen w-screen">
            <NavBar nameTitle={activeScreen == "immobileScreen" ? "Imóveis" : "Usuários"} />
            <div className="flex h-[calc(100vh-5rem)]">
                <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-gray-200 bg-white p-4">
                    <nav className="flex flex-col gap-1.5">
                        {userIsAdmin &&
                            <button
                                className={navItemClass(activeScreen === "immobileScreen")}
                                onClick={() => setActiveScreen("immobileScreen")}
                            >
                                <House size={20} />
                                Imóveis
                            </button>
                        }
                        <button
                            className={navItemClass(activeScreen === "usersScreen")}
                            onClick={() => setActiveScreen("usersScreen")}
                        >
                            <User size={20} />
                            Usuários
                        </button>
                    </nav>

                    <button
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        onClick={() => {
                            localStorage.removeItem("token")
                            navigator("/admin")
                        }}
                    >
                        <DoorOpen size={20} />
                        Sair
                    </button>
                </aside>
                <main className="min-w-0 flex-1 overflow-y-auto bg-(--background) p-4">
                    {activeScreen == "immobileScreen" ?
                        <ImmobileList />
                        :
                        <UsersList />
                    }
                </main>
            </div>
        </div>
    )
}
