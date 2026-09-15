import { Button, Chip } from "@heroui/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Images, Pen, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { AppPagination } from "../../../../../components/AppPagination";
import { LoadingOverlay } from "../../../../../components/LoadingOverlay";
import type { ImmobilesShortData } from "../../../../../models/responseInterfaces/ImmobilesShortData";
import { BrazilianState } from "../../../../../models/types/brazilianStatesEnum";
import { ImmobileTypesEnum } from "../../../../../models/types/immobileTypesEnum";
import { ImmobilesServices } from "../../../../../services/immobiles-services";
import { GalleryModal } from "./components/GalleryModal";
import { ImmobilesCreationModal } from "./components/ImmobileCreationModal";
import { ImmobileDeleteDialog } from "./components/ImmobileDeleteDialog";

dayjs.locale("pt-br");
dayjs.extend(utc);
dayjs.extend(timezone);

const formatCurrency = (value: number) => {
    if (!value) return "";
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

export function ImmobileList() {
    const [pagesNumber, setPagesNumber] = useState<number>(0);
    const [atualPage, setAtualPage] = useState<number>(1);
    const [immobilesData, setImmobilesData] = useState<ImmobilesShortData[]>([])
    const [selectedImmobileId, setSelectedImmobileId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);


    const fetchImmobilesList = async () => {
        setIsLoading(true)
        try {
            const service = new ImmobilesServices();

            const response = await service.ListImmobiles(10, atualPage);
            setImmobilesData(response.immobiles)
            setPagesNumber(response.pageNumber)
        } catch (error) {
            alert("Erro de servidor")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchImmobilesList()

    }, [atualPage, isModalOpen])

    return (
        <div className="flex h-full w-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

            <LoadingOverlay open={isLoading} />

            <ImmobilesCreationModal isModalOpen={isModalOpen} selectedImmobileId={selectedImmobileId} setIsModalOpen={setIsModalOpen} setSelectedImmobileId={setSelectedImmobileId} />
            <ImmobileDeleteDialog isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} immobileId={selectedImmobileId} setSelectedImmobileId={setSelectedImmobileId} />
            <GalleryModal immobileId={selectedImmobileId} setIsOpen={setIsGalleryModalOpen} isOpen={isGalleryModalOpen} />

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-(--primary-color)">Imóveis cadastrados</h2>
                <Button
                    isIconOnly
                    onPress={() => {
                        setSelectedImmobileId(null)
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
                            <th className="py-3 pr-3">Tipo</th>
                            <th className="py-3 pr-3">Código Postal</th>
                            <th className="py-3 pr-3">Cidade</th>
                            <th className="py-3 pr-3">Estado</th>
                            <th className="py-3 pr-3">Valor</th>
                            <th className="py-3 pr-3">Link</th>
                            <th className="py-3 pr-3">Comandos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {immobilesData.length > 0 && immobilesData.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="py-3 pr-3">
                                    <Chip size="sm" className="bg-(--primary-color) text-white">
                                        {Object.values(ImmobileTypesEnum)[parseInt(row.immobileType)]}
                                    </Chip>
                                </td>
                                <td className="py-3 pr-3">{row.postalCode}</td>
                                <td className="py-3 pr-3">{row.city}</td>
                                <td className="py-3 pr-3">{Object.values(BrazilianState)[parseInt(row.state)]}</td>
                                <td className="py-3 pr-3 font-medium">{formatCurrency(row.value)}</td>
                                <td className="py-3 pr-3">
                                    <a
                                        href={row.localLink}
                                        className="text-blue-600 underline hover:text-blue-800"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Acesse o local
                                    </a>
                                </td>
                                <td className="py-3 pr-3">
                                    <div className="flex flex-row gap-1.5">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600"
                                            onPress={() => {
                                                setSelectedImmobileId(row.id)
                                                setIsGalleryModalOpen(true)
                                            }}
                                        >
                                            <Images size={18} />
                                        </Button>

                                        <Button
                                            isIconOnly
                                            size="sm"
                                            className="bg-amber-500 hover:bg-amber-600"
                                            onPress={() => {
                                                setSelectedImmobileId(row.id)
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
                                                setSelectedImmobileId(row.id)
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

                {immobilesData.length === 0 && !isLoading && (
                    <p className="py-10 text-center text-sm text-gray-500">Nenhum imóvel cadastrado</p>
                )}
            </div>

            <AppPagination page={atualPage} count={pagesNumber} onChange={setAtualPage} />
        </div>
    );
}
