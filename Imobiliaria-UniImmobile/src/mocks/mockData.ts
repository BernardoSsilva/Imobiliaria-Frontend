import casa2 from "../assets/casa2.png";
import casa3 from "../assets/casa3.png";
import immobileDetailImage from "../assets/ImageImmobileDetails.png";
import type { ImageEntity } from "../models/image";
import type { ImmobileEntity } from "../models/immobile";
import type { ImmobilesShortData } from "../models/responseInterfaces/ImmobilesShortData";
import { BrazilianState } from "../models/types/brazilianStatesEnum";
import { ImmobileTypesEnum } from "../models/types/immobileTypesEnum";
import { UserRolesEnum } from "../models/types/userRolesEnum";
import type { UserEntity } from "../models/user";

const immobileTypeValues = Object.values(ImmobileTypesEnum);
const stateValues = Object.values(BrazilianState);

export const mockUsers: UserEntity[] = [
    {
        id: "user-1",
        userName: "Douglas Andrade",
        userEmail: "douglas@uniimmobile.com",
        role: UserRolesEnum.ADMIN,
        phone: "5511999990000",
        bornDate: new Date("1985-04-12"),
        createdAt: new Date("2023-01-10"),
        password: "",
    },
    {
        id: "user-2",
        userName: "Marina Souza",
        userEmail: "marina@uniimmobile.com",
        role: UserRolesEnum.OPERATOR,
        phone: "5511988880000",
        bornDate: new Date("1992-08-25"),
        createdAt: new Date("2023-05-22"),
        password: "",
    },
    {
        id: "user-3",
        userName: "Carlos Lima",
        userEmail: "carlos@uniimmobile.com",
        role: UserRolesEnum.OPERATOR,
        phone: "5511977770000",
        bornDate: new Date("1990-01-30"),
        createdAt: new Date("2024-02-14"),
        password: "",
    },
];

export const mockImmobiles: ImmobileEntity[] = [
    {
        id: "immobile-1",
        localityInfo: "Casa térrea com quintal amplo",
        immobileType: ImmobileTypesEnum.HOUSE,
        localLink: "https://maps.google.com",
        value: 420000,
        userCreationId: "user-1",
        creationDate: new Date("2024-03-01"),
        postalCode: "88010-000",
        state: BrazilianState.SC,
        city: "Florianópolis",
        street: "Rua das Palmeiras, 120",
        neighborhood: "Centro",
        hasScripture: true,
        immobileDescription: "Casa reformada, próxima à praia, com 3 quartos e área gourmet.",
    },
    {
        id: "immobile-2",
        localityInfo: "Apartamento moderno com vista para o mar",
        immobileType: ImmobileTypesEnum.APARTMENT,
        localLink: "https://maps.google.com",
        value: 780000,
        userCreationId: "user-2",
        creationDate: new Date("2024-05-18"),
        postalCode: "88015-100",
        state: BrazilianState.SC,
        city: "Florianópolis",
        street: "Av. Beira Mar Norte, 850",
        neighborhood: "Agronômica",
        hasScripture: true,
        immobileDescription: "Apartamento de 2 quartos, sacada gourmet e vista panorâmica para o mar.",
    },
    {
        id: "immobile-3",
        localityInfo: "Terreno plano pronto para construir",
        immobileType: ImmobileTypesEnum.LAND,
        localLink: "https://maps.google.com",
        value: 195000,
        userCreationId: "user-1",
        creationDate: new Date("2024-07-09"),
        postalCode: "88095-300",
        state: BrazilianState.SC,
        city: "Palhoça",
        street: "Rua Amazonas, 45",
        neighborhood: "Ponte do Imaruim",
        hasScripture: false,
        immobileDescription: "Terreno plano de 360m², em condomínio fechado com infraestrutura completa.",
    },
    {
        id: "immobile-4",
        localityInfo: "Casa de condomínio com piscina",
        immobileType: ImmobileTypesEnum.HOUSE,
        localLink: "https://maps.google.com",
        value: 950000,
        userCreationId: "user-3",
        creationDate: new Date("2024-09-02"),
        postalCode: "88056-000",
        state: BrazilianState.SC,
        city: "São José",
        street: "Rua das Acácias, 300",
        neighborhood: "Campinas",
        hasScripture: true,
        immobileDescription: "Casa em condomínio fechado com piscina, 4 suítes e churrasqueira.",
    },
];

// The list endpoints return the type/state as a numeric index (matched by
// `Object.values(Enum)[parseInt(...)]` in the admin table and the public card).
export const mockImmobilesShortData: ImmobilesShortData[] = mockImmobiles.map((immobile) => ({
    id: immobile.id,
    localityInfo: immobile.localityInfo,
    immobileType: String(immobileTypeValues.indexOf(immobile.immobileType)) as unknown as ImmobileTypesEnum,
    value: immobile.value,
    postalCode: immobile.postalCode,
    state: String(stateValues.indexOf(immobile.state)) as unknown as BrazilianState,
    city: immobile.city,
    localLink: immobile.localLink,
}));

const imagePool = [casa2, casa3, immobileDetailImage];

export const mockImagesByImmobile: Record<string, ImageEntity[]> = Object.fromEntries(
    mockImmobiles.map((immobile) => [
        immobile.id,
        imagePool.map((url, imgIndex) => ({
            id: `${immobile.id}-image-${imgIndex}`,
            imageUrl: url,
            immobileId: immobile.id,
        })),
    ]),
);
