import { Chip } from "@heroui/react";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ImageEntity } from "../../../../models/image";
import type { ImmobilesShortData } from "../../../../models/responseInterfaces/ImmobilesShortData";
import { BrazilianState } from "../../../../models/types/brazilianStatesEnum";
import { ImmobileTypesEnum } from "../../../../models/types/immobileTypesEnum";
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

  return (
    <button
      onClick={handleClick}
      className="group flex w-full max-w-72 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={immobileFirstImage?.imageUrl}
          alt={immobile.localityInfo}
        />
        <Chip
          size="sm"
          className="absolute top-3 left-3 bg-(--primary-color) text-white shadow"
        >
          {Object.values(ImmobileTypesEnum)[parseInt(immobile.immobileType)] ?? immobile.immobileType}
        </Chip>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-1 font-semibold text-gray-900">{immobile.localityInfo}</h3>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} className="shrink-0" />
          <span className="line-clamp-1">
            {immobile.city} - {Object.values(BrazilianState)[parseInt(immobile.state)] ?? immobile.state}
          </span>
        </p>
        <p className="mt-1 text-lg font-bold text-(--primary-color)">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(immobile.value)}
        </p>
      </div>
    </button>
  );
}
