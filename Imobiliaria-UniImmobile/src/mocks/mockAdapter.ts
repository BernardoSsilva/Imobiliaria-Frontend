import MockAdapter from "axios-mock-adapter";
import { v4 as uuid } from "uuid";
import { server } from "../services/Axios";
import {
    mockImagesByImmobile,
    mockImmobiles,
    mockImmobilesShortData,
    mockUsers,
} from "./mockData";

const PER_PAGE_DEFAULT = 10;

function paginate<T>(items: T[], page: number, perPage: number) {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
}

export function enableMocks() {
    const mock = new MockAdapter(server, { delayResponse: 400 });

    mock.onGet("/Immobiles").reply((config) => {
        const page = Number(config.params?.page ?? 1);
        const perPage = Number(config.params?.perPage ?? PER_PAGE_DEFAULT);

        return [
            200,
            {
                immobiles: paginate(mockImmobilesShortData, page, perPage),
                PaginationParams: { Page: page, PerPage: perPage },
                TotalAmount: mockImmobilesShortData.length,
                pageNumber: Math.max(1, Math.ceil(mockImmobilesShortData.length / perPage)),
            },
        ];
    });

    mock.onGet(/\/Immobiles\/[^/]+\/Images/).reply((config) => {
        const immobileId = config.url?.split("/")[2];
        return [200, mockImagesByImmobile[immobileId ?? ""] ?? []];
    });

    mock.onGet(/\/Immobiles\/[^/]+$/).reply((config) => {
        const immobileId = config.url?.split("/").pop();
        const immobile = mockImmobiles.find((item) => item.id === immobileId);
        return immobile ? [200, immobile] : [404, "Imóvel não encontrado"];
    });

    mock.onPost("/Immobiles").reply(() => {
        return [201, { id: uuid() }];
    });

    mock.onPut(/\/Immobiles\/[^/]+$/).reply(() => [200]);
    mock.onDelete(/\/Immobiles\/[^/]+$/).reply(() => [200]);

    mock.onPost(/\/Images\/[^/]+\/create/).reply(() => [201]);
    mock.onDelete(/\/Images\/[^/]+\/delete/).reply(() => [200]);

    mock.onPost("/Users/Login").reply(() => {
        return [
            200,
            {
                token: "mock-token",
                user: { id: mockUsers[0].id },
            },
        ];
    });

    mock.onGet("/Users").reply((config) => {
        const page = Number(config.params?.page ?? 1);
        const perPage = Number(config.params?.perPage ?? PER_PAGE_DEFAULT);

        return [
            200,
            {
                users: paginate(mockUsers, page, perPage),
                PaginationParams: { Page: page, PerPage: perPage },
                TotalAmount: mockUsers.length,
                pageNumber: Math.max(1, Math.ceil(mockUsers.length / perPage)),
            },
        ];
    });

    mock.onGet(/\/Users\/[^/]+$/).reply((config) => {
        const userId = config.url?.split("/").pop();
        const user = mockUsers.find((item) => item.id === userId) ?? mockUsers[0];
        return [200, user];
    });

    mock.onPost("/Users").reply(() => [201]);
    mock.onPut(/\/Users\/[^/]+$/).reply(() => [200]);
    mock.onDelete(/\/Users\/[^/]+$/).reply(() => [200]);

    // Anything else (e.g. the real CEP lookup) passes through untouched.
    mock.onAny().passThrough();

    if (!localStorage.getItem("token")) {
        localStorage.setItem("token", "mock-token");
    }
    if (!localStorage.getItem("userId")) {
        localStorage.setItem("userId", mockUsers[0].id);
    }
}
