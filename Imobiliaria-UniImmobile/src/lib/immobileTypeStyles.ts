import { ImmobileTypesEnum } from "../models/types/immobileTypesEnum";

export const immobileTypeChipClass: Record<ImmobileTypesEnum, string> = {
    [ImmobileTypesEnum.HOUSE]: "bg-blue-600 text-white",
    [ImmobileTypesEnum.APARTMENT]: "bg-violet-600 text-white",
    [ImmobileTypesEnum.LAND]: "bg-emerald-600 text-white",
};
