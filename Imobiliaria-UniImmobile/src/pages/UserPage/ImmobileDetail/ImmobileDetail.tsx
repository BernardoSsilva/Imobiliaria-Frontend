import { Button, Card, Chip } from "@heroui/react";
import { ArrowLeft, Landmark, MapPin, MessageCircle, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOverlay } from "../../../components/LoadingOverlay";
import { NavBar } from "../../../components/NavBar";
import type { ImageEntity } from "../../../models/image";
import type { ImmobileEntity } from "../../../models/immobile";
import { ImageServices } from "../../../services/images-services";
import { ImmobilesServices } from "../../../services/immobiles-services";
import { UserServices } from "../../../services/user-services";
import { ImageSlider } from "./components/ImageSlider";

export function ImmobileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [immobile, setImmobile] = useState<ImmobileEntity | null>(null);
  const [immobileImages, setImmobileImages] = useState<ImageEntity[]>([]);
  const [responsibleUserPhone, setResponsibleUserPhone] = useState<string>();

  const service = new ImmobilesServices();
  const imagesService = new ImageServices();
  const userServices = new UserServices();

  useEffect(() => {
    fetchImmobile();
  }, [id]);

  const fetchImmobile = async () => {
    const immobile = await service.SelectImmobile(id ?? "");
    const images = await imagesService.ListImages(id ?? "");
    try {
      setImmobile(immobile);
      setImmobileImages(images);
    } finally {
      const responsibleUser = await userServices.findUser(immobile.userCreationId);
      setResponsibleUserPhone(responsibleUser.phone);
    }
  };

  if (!immobile) return <LoadingOverlay open label="Carregando imóvel" />;

  return (
    <div className="min-h-screen bg-(--background)">
      <NavBar nameTitle="Detalhes do Imóvel" />

      <div className="mx-auto max-w-6xl p-4 sm:p-8">
        <Button variant="ghost" onPress={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={20} />
          Voltar
        </Button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ImageSlider images={immobileImages} />

          <div className="flex flex-col gap-4 text-gray-800">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-bold text-(--primary-color)">
                {immobile.localityInfo}
              </h2>
              <Chip className="shrink-0 bg-(--primary-color) text-white">
                {immobile.immobileType}
              </Chip>
            </div>

            <Card>
              <Card.Content className="flex flex-col gap-1.5">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  <MapPin size={14} /> Localização
                </h3>
                <p className="text-sm text-gray-700">{immobile.immobileDescription}</p>
                <p className="text-sm">{immobile.city}, {immobile.street}</p>
                <p className="text-sm">CEP: {immobile.postalCode}</p>
                <p className="text-sm">Bairro: {immobile.neighborhood}</p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex flex-col gap-1.5">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  <Landmark size={14} /> Informações
                </h3>
                <p className="text-sm">Tipo: {immobile.immobileType}</p>
                <p className="text-sm">Escriturado: {immobile.hasScripture ? "Sim" : "Não"}</p>
                <a
                  className="text-sm font-medium text-(--primary-color) underline underline-offset-2 hover:text-(--primary-color-hover)"
                  href={immobile.localLink}
                  target="_blank"
                >
                  Localização do imóvel
                </a>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex flex-col gap-1.5">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  <Tag size={14} /> Valor
                </h3>
                <p className="text-xl font-bold text-(--primary-color)">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(immobile.value)}
                </p>
              </Card.Content>
            </Card>

            <a
              className="flex w-fit items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-green-700"
              href={`https://wa.me/${responsibleUserPhone}`}
              target="_blank"
            >
              <MessageCircle size={22} />
              Enviar Mensagem
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImmobileDetail;
