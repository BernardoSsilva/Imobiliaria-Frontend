import { useEffect, useState } from "react";
import { AppPagination } from "../../../components/AppPagination";
import { LoadingOverlay } from "../../../components/LoadingOverlay";
import { NavBar } from "../../../components/NavBar";
import type { ImmobilesShortData } from "../../../models/responseInterfaces/ImmobilesShortData";
import { ImmobilesServices } from "../../../services/immobiles-services";
import { ImmobileCard } from "./cardComponent/Card";

export function Home() {

    const [isLoading, setIsLoading] = useState(false);
    const [immobilesList, setImmobilesList] = useState<ImmobilesShortData[]>([])
    const [pagesNumber, setPagesNumber] = useState<number>(0);
    const [atualPage, setAtualPage] = useState<number>(1);

    const services = new ImmobilesServices()
    const fetchImmobiles = async () => {
        setIsLoading(true)
        try {

            const result = await services.ListImmobiles(10, atualPage)

            setPagesNumber(result.pageNumber)
            setImmobilesList(result.immobiles)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchImmobiles();
    }, [atualPage])


    return (
        <div className="min-h-screen bg-(--background)">
            <LoadingOverlay open={isLoading} />

            <NavBar nameTitle="Seja bem-vindo!" />

            <section className="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6">
                <h1 className="text-2xl font-bold text-(--primary-color) sm:text-3xl">
                    Encontre o imóvel ideal para você
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Confira as opções disponíveis em nosso catálogo
                </p>
            </section>

            <section className="mx-auto flex max-w-7xl flex-wrap justify-center gap-6 px-4 pb-6 sm:justify-start sm:px-6">
                {immobilesList.length > 0 ? immobilesList.map(e => {
                    return <ImmobileCard key={e.id} immobile={e} />
                }) :
                    !isLoading && (
                        <div className="flex w-full flex-col items-center gap-2 py-20 text-center">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Nenhum imóvel encontrado
                            </h2>
                            <p className="text-sm text-gray-500">Volte mais tarde para conferir novidades.</p>
                        </div>
                    )}
            </section>

            <AppPagination page={atualPage} count={pagesNumber} onChange={setAtualPage} />
        </div>
    );
}
