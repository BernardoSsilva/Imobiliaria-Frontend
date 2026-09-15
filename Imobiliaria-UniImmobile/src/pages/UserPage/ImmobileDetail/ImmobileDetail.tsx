import { Button, Card, Chip, Separator } from "@heroui/react";
import { ArrowLeft, MapPin, MessageCircle, ScrollText, Tag } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOverlay } from "../../../components/LoadingOverlay";
import { NavBar } from "../../../components/NavBar";
import type { ImageEntity } from "../../../models/image";
import type { ImmobileEntity } from "../../../models/immobile";
import { immobileTypeChipClass } from "../../../lib/immobileTypeStyles";
import { ImageServices } from "../../../services/images-services";
import { ImmobilesServices } from "../../../services/immobiles-services";
import { UserServices } from "../../../services/user-services";
import { ImageSlider } from "./components/ImageSlider";

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-(--brand-sand)">{icon}</span>
      <div className="flex flex-1 flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-800">{value}</span>
      </div>
    </div>
  );
}

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

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <Button variant="ghost" onPress={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={20} />
          Voltar
        </Button>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <Chip size="sm" className={immobileTypeChipClass[immobile.immobileType] ?? "bg-(--primary-color) text-white"}>
              {immobile.immobileType}
            </Chip>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={14} />
              {immobile.city}, {immobile.neighborhood}
            </span>
          </div>
          <h1 className="mt-2 font-serif text-2xl leading-tight font-bold text-(--primary-color) sm:text-3xl">
            {immobile.localityInfo}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-3">
            <ImageSlider images={immobileImages} />

            <Card>
              <Card.Content className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Sobre o imóvel
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  {immobile.immobileDescription}
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content>
                <h3 className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Localização
                </h3>
                <Separator />
                <InfoRow icon={<MapPin size={18} />} label="Endereço" value={`${immobile.street}, ${immobile.city}`} />
                <Separator />
                <InfoRow icon={<MapPin size={18} />} label="Bairro" value={immobile.neighborhood} />
                <Separator />
                <InfoRow icon={<MapPin size={18} />} label="CEP" value={immobile.postalCode} />
                <Separator />
                <a
                  className="mt-2 inline-block text-sm font-medium text-(--primary-color) underline underline-offset-2 hover:text-(--primary-color-hover)"
                  href={immobile.localLink}
                  target="_blank"
                >
                  Ver localização no mapa
                </a>
              </Card.Content>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4 lg:sticky lg:top-28">
              <Card className="overflow-hidden border-t-4 border-t-(--brand-sand)">
                <Card.Content className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    <Tag size={14} /> Valor do imóvel
                  </span>
                  <p className="text-3xl font-bold text-(--primary-color)">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(immobile.value)}
                  </p>

                  <Separator className="my-2" />

                  <InfoRow icon={<Tag size={18} />} label="Tipo de imóvel" value={immobile.immobileType} />
                  <Separator />
                  <InfoRow
                    icon={<ScrollText size={18} />}
                    label="Escriturado"
                    value={immobile.hasScripture ? "Sim" : "Não"}
                  />

                  <a
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                    href={`https://wa.me/${responsibleUserPhone}`}
                    target="_blank"
                  >
                    <MessageCircle size={22} />
                    Enviar Mensagem
                  </a>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImmobileDetail;
