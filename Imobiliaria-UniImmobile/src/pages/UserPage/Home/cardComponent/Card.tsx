import { Chip } from "@heroui/react";
import { ArrowRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ImageEntity } from "../../../../models/image";
import type { ImmobilesShortData } from "../../../../models/responseInterfaces/ImmobilesShortData";
import { BrazilianState } from "../../../../models/types/brazilianStatesEnum";
import { ImmobileTypesEnum } from "../../../../models/types/immobileTypesEnum";
import { immobileTypeChipClass } from "../../../../lib/immobileTypeStyles";
import { ImageServices } from "../../../../services/images-services";

interface CardProps {
  immobile: ImmobilesShortData;
}

export function ImmobileCard({ immobile }: CardProps) {
  const navigate = useNavigate();
  const services = new ImageServices();
  const [immobileFirstImage, setImmobileFirstImage] = useState<ImageEntity | null>(null);

  useEffect(() => {
    if (immobile.id) {
      fetchImages();
    }
  }, [immobile.id]);


  const fetchImages = async () => {
    setImmobileFirstImage((await services.ListImages(immobile.id))[0])
  }

  const handleClick = () => {
    navigate(`/immobile/${immobile.id}`);
  };

  const typeLabel = Object.values(ImmobileTypesEnum)[parseInt(immobile.immobileType)] ?? immobile.immobileType;

  return (
    <button
      onClick={handleClick}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={immobileFirstImage?.imageUrl}
          alt={immobile.localityInfo}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <Chip
          size="sm"
          className={`absolute top-3 left-3 shadow ${immobileTypeChipClass[typeLabel as ImmobileTypesEnum] ?? "bg-(--primary-color) text-white"}`}
        >
          {typeLabel}
        </Chip>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-1 font-semibold text-gray-900">{immobile.localityInfo}</h3>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} className="shrink-0 text-(--brand-sand)" />
          <span className="line-clamp-1">
            {immobile.city} - {Object.values(BrazilianState)[parseInt(immobile.state)] ?? immobile.state}
          </span>
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2.5">
          <p className="text-lg font-bold text-(--primary-color)">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(immobile.value)}
          </p>
          <span className="flex items-center gap-1 text-xs font-semibold text-(--brand-sand) opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Ver mais
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}
