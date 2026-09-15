import { useEffect, useState } from "react";
import heroImage from "../../../assets/imagemfundo.png";
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
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [atualPage, setAtualPage] = useState<number>(1);

    const services = new ImmobilesServices()
    const fetchImmobiles = async () => {
        setIsLoading(true)
        try {

            const result = await services.ListImmobiles(10, atualPage)

            setPagesNumber(result.pageNumber)
            setTotalAmount(result.TotalAmount)
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

            <section className="relative flex h-[320px] items-end overflow-hidden sm:h-[420px]">
                <img
                    src={heroImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-(--primary-color) via-(--primary-color)/75 to-(--primary-color)/10" />

                <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
                    <p className="font-serif text-xs tracking-[0.35em] text-(--brand-sand-light) uppercase">
                        UniImmobile
                    </p>
                    <h1 className="mt-2 max-w-xl font-serif text-3xl leading-tight font-bold text-white sm:text-5xl">
                        Encontre o imóvel dos seus sonhos
                    </h1>
                    <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">
                        Casas, apartamentos e terrenos selecionados com cuidado para você.
                    </p>
                </div>
            </section>

            <section className="relative z-10 mx-auto -mt-6 flex max-w-7xl justify-center px-4 sm:justify-start sm:px-6">
                <div className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-(--primary-color) shadow-lg">
                    {totalAmount > 0 ? `${totalAmount} imóveis disponíveis` : "Confira nosso catálogo"}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pt-8 pb-2 sm:px-6">
                <h2 className="text-lg font-bold text-(--primary-color) sm:text-xl">
                    Imóveis em destaque
                </h2>
            </section>

            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pt-4 pb-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4">
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
