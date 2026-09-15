import { Avatar, Button, Chip } from "@heroui/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Pen, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { AppPagination } from "../../../../../components/AppPagination";
import { LoadingOverlay } from "../../../../../components/LoadingOverlay";
import type { UserEntity } from "../../../../../models/user";
import { UserServices } from "../../../../../services/user-services";
import { UserCreationModal } from "./components/UserCreationModal";
import { UserDeleteDialog } from "./components/UserDeleteDialog";


dayjs.locale("pt-br");
dayjs.extend(utc);
dayjs.extend(timezone);

export function UsersList() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [pagesNumber, setPagesNumber] = useState<number>(0);
    const [usersData, setUsersData] = useState<UserEntity[]>([]);
    const [atualPage, setAtualPage] = useState<number>(1);

    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true)

        try {
            const service = new UserServices();

            const responseData = (await service.listUsers(10, atualPage))
            setUsersData(responseData.users);
            setPagesNumber(responseData.pageNumber);
        } catch (error) {
            alert("Erro de servidor")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [atualPage, isModalOpen, isDeleteModalOpen]);

    return (
        <div className="flex h-full w-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <LoadingOverlay open={isLoading} />

            <UserCreationModal isModalOpen={isModalOpen} setIsModalOpen={(value) => setIsModalOpen(value)} userId={selectedUserId} setSelectedUserId={setSelectedUserId} />
            <UserDeleteDialog isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} userId={selectedUserId ?? ""} setSelectedUserId={setSelectedUserId} />

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-(--primary-color)">Usuários cadastrados</h2>
                <Button
                    isIconOnly
                    onPress={() => {
                        setSelectedUserId(null)
                        setIsModalOpen(true)
                    }}
                    className="rounded-full"
                >
                    <Plus size={20} />
                </Button>
            </div>

            <div className="w-full min-w-0 flex-1 overflow-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-xs tracking-wide text-gray-500 uppercase">
                            <th className="py-3 pr-3">Nome do usuário</th>
                            <th className="py-3 pr-3">Data de nascimento</th>
                            <th className="py-3 pr-3">Data de criação</th>
                            <th className="py-3 pr-3">Email</th>
                            <th className="py-3 pr-3">Tipo de usuário</th>
                            <th className="py-3 pr-3">Comandos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {usersData.length > 0 && usersData.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="py-3 pr-3">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar size="sm" color="accent">
                                            <Avatar.Fallback>
                                                {row.userName.slice(0, 2).toUpperCase()}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <span className="font-medium">{row.userName}</span>
                                    </div>
                                </td>
                                <td className="py-3 pr-3">
                                    {dayjs(row.bornDate).tz("America/Sao_Paulo").format("D [de] MMMM [de] YYYY")}
                                </td>
                                <td className="py-3 pr-3">
                                    {dayjs(row.createdAt).tz("America/Sao_Paulo").format("D [de] MMMM [de] YYYY")}
                                </td>
                                <td className="py-3 pr-3">{row.userEmail}</td>
                                <td className="py-3 pr-3">
                                    <Chip size="sm" className="bg-(--primary-color) text-white">{row.role}</Chip>
                                </td>
                                <td className="py-3 pr-3">
                                    <div className="flex flex-row gap-1.5">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            className="bg-amber-500 hover:bg-amber-600"
                                            onPress={() => {
                                                setSelectedUserId(row.id)
                                                setIsModalOpen(true)
                                            }}
                                        >
                                            <Pen size={18} />
                                        </Button>

                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="danger"
                                            onPress={() => {
                                                setSelectedUserId(row.id)
                                                setIsDeleteModalOpen(true)
                                            }}
                                        >
                                            <Trash size={18} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {usersData.length === 0 && !isLoading && (
                    <p className="py-10 text-center text-sm text-gray-500">Nenhum usuário cadastrado</p>
                )}
            </div>

            <AppPagination page={atualPage} count={pagesNumber} onChange={setAtualPage} />
        </div>
    );
}
