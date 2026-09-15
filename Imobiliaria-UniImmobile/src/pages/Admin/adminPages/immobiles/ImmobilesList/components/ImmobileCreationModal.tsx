import { Alert, Button, Checkbox, Input, Label, Modal, TextArea, TextField } from "@heroui/react";
import type { AxiosError } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { FormSelect } from "../../../../../../components/FormSelect";
import type { ImmobileCreationDto } from "../../../../../../models/DTOs/ImmobileCreationDTO";
import type { ImmobileUpdateDto } from "../../../../../../models/DTOs/ImmobileUpdateDto";
import { BrazilianState } from "../../../../../../models/types/brazilianStatesEnum";
import { ImmobileTypesEnum } from "../../../../../../models/types/immobileTypesEnum";
import { ImmobilesServices } from "../../../../../../services/immobiles-services";

type Props = {
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void
    selectedImmobileId: string | null
    setSelectedImmobileId: (value: string | null) => void;
}

const immobileTypeOptions = Object.values(ImmobileTypesEnum).map((name) => ({ key: name, label: name }));
const stateOptions = Object.values(BrazilianState).map((uf) => ({ key: uf, label: uf }));

export function ImmobilesCreationModal(
    {
        isModalOpen,
        setIsModalOpen,
        selectedImmobileId,
        setSelectedImmobileId
    }: Props
) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [immobileType, setImmobileType] = useState<ImmobileTypesEnum>(ImmobileTypesEnum.LAND);
    const [localityInfo, setLocalityInfo] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [state, setState] = useState<BrazilianState>(BrazilianState.SC);
    const [street, setStreet] = useState("");
    const [value, setValue] = useState(0);
    const [localLink, setLocalLink] = useState("");
    const [hasScripture, setHasScripture] = useState(false);
    const [immobileDescription, setImmobileDescription] = useState("");


    const formatCEP = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .slice(0, 9);
    };

    const formatCurrency = (value: number) => {
        if (!value) return "";
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const fetchCepData = async (cep: string) => {
        try {
            const cleanCep = cep.replace(/\D/g, "");
            if (cleanCep.length !== 8) return;

            const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
            const data = response.data;

            setCity(data.city || "");
            setNeighborhood(data.neighborhood || "");
            setStreet(data.street || "");

            const stateMap: Record<string, keyof typeof BrazilianState> = {
                AC: "AC", AL: "AL", AP: "AP", AM: "AM",
                BA: "BA", CE: "CE", DF: "DF", ES: "ES",
                GO: "GO", MA: "MA", MT: "MT", MS: "MS",
                MG: "MG", PA: "PA", PB: "PB", PR: "PR",
                PE: "PE", PI: "PI", RJ: "RJ", RN: "RN",
                RS: "RS", RO: "RO", RR: "RR", SC: "SC",
                SP: "SP", SE: "SE", TO: "TO"
            };

            const uf = data.state as keyof typeof stateMap;
            if (uf && BrazilianState[stateMap[uf]]) {
                setState(BrazilianState[stateMap[uf]]);
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setErrorMessage("CEP inválido ou não encontrado.");
        }
    };


    const fetchSelectedImmobile = async () => {
        const service = new ImmobilesServices();
        const immobile = await service.SelectImmobile(selectedImmobileId ?? "");

        setImmobileType(immobile.immobileType);
        setLocalityInfo(immobile.localityInfo);
        setPostalCode(immobile.postalCode);
        setCity(immobile.city);
        setNeighborhood(immobile.neighborhood);
        setState(immobile.state);
        setStreet(immobile.street);
        setValue(immobile.value);
        setLocalLink(immobile.localLink);
        setHasScripture(immobile.hasScripture);
        setImmobileDescription(immobile.immobileDescription);
    }

    const saveImmobile = async () => {
        const service = new ImmobilesServices();
        const states = Object.values(BrazilianState);
        const types = Object.values(ImmobileTypesEnum)
        try {
            if (selectedImmobileId) {
                const data: ImmobileUpdateDto = {
                    city,
                    hasScripture,
                    immobileDescription,
                    immobileType: types.indexOf(immobileType),
                    localityInfo,
                    localLink,
                    neighborhood,
                    postalCode,
                    state: states.indexOf(state),
                    street,
                    value
                };

                await service.UpdateImmobile(data, selectedImmobileId);
                alert("Imóvel atualizado com sucesso");
            } else {
                const data: ImmobileCreationDto = {
                    city,
                    hasScripture,
                    immobileDescription,
                    immobileType: types.indexOf(immobileType),
                    localityInfo,
                    localLink,
                    neighborhood,
                    postalCode,
                    state: states.indexOf(state),
                    street,
                    value
                };

                await service.PostNewImmobile(data);
                alert("Imóvel criado com sucesso");
            }

        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 400) {
                setErrorMessage(error.response.data as string);
            } else if (error.response?.status === 401) {
                setErrorMessage(error.response.data?.toString() ?? "Não autorizado");
            } else {
                setErrorMessage("Erro desconhecido!");
            }
        } finally {
            resetForm();
        }

        setTimeout(() => setErrorMessage(null), 5000);
    };

    const resetForm = () => {
        setImmobileType(ImmobileTypesEnum.LAND);
        setLocalityInfo("");
        setPostalCode("");
        setCity("");
        setNeighborhood("");
        setState(BrazilianState.SC);
        setStreet("");
        setValue(0);
        setLocalLink("");
        setHasScripture(false);
        setImmobileDescription("");
        setSelectedImmobileId(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (selectedImmobileId) {
            fetchSelectedImmobile();
        }
    }, [isModalOpen]);

    return (
        <>
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog className="max-h-[85vh] overflow-y-auto">
                            <Modal.Header>
                                <Modal.Heading>
                                    {selectedImmobileId ? "Editar Imóvel" : "Cadastrar Imóvel"}
                                </Modal.Heading>
                                <Modal.CloseTrigger onPress={resetForm} />
                            </Modal.Header>

                            <Modal.Body>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        saveImmobile();
                                    }}
                                >
                                    <FormSelect
                                        label="Tipo de Imóvel"
                                        selectedKey={immobileType}
                                        onSelectionChange={(key) => setImmobileType(key as ImmobileTypesEnum)}
                                        options={immobileTypeOptions}
                                    />

                                    <TextField value={localityInfo} onChange={setLocalityInfo}>
                                        <Label>Titulo do imóvel</Label>
                                        <Input />
                                    </TextField>

                                    <TextField
                                        value={postalCode}
                                        onChange={(newValue) => {
                                            const formatted = formatCEP(newValue);
                                            setPostalCode(formatted);

                                            const cleanCep = formatted.replace(/\D/g, "");
                                            if (cleanCep.length === 8) {
                                                fetchCepData(cleanCep);
                                            }
                                        }}
                                    >
                                        <Label>Código Postal</Label>
                                        <Input />
                                    </TextField>

                                    <FormSelect
                                        label="Estado"
                                        selectedKey={state}
                                        onSelectionChange={(key) => setState(key as BrazilianState)}
                                        options={stateOptions}
                                    />

                                    <TextField value={city} onChange={setCity}>
                                        <Label>Cidade</Label>
                                        <Input />
                                    </TextField>

                                    <TextField value={neighborhood} onChange={setNeighborhood}>
                                        <Label>Bairro</Label>
                                        <Input />
                                    </TextField>

                                    <TextField value={street} onChange={setStreet}>
                                        <Label>Rua</Label>
                                        <Input />
                                    </TextField>

                                    <TextField
                                        value={formatCurrency(value)}
                                        onChange={(newValue) => {
                                            const raw = newValue.replace(/\D/g, "");
                                            const number = parseFloat(raw) / 100;
                                            setValue(isNaN(number) ? 0 : number);
                                        }}
                                    >
                                        <Label>Preço</Label>
                                        <Input />
                                    </TextField>

                                    <TextField value={localLink} onChange={setLocalLink} type="url">
                                        <Label>Link de Localização</Label>
                                        <Input />
                                    </TextField>

                                    <TextField value={immobileDescription} onChange={setImmobileDescription}>
                                        <Label>Descrição do Imóvel</Label>
                                        <TextArea rows={3} />
                                    </TextField>

                                    <Checkbox isSelected={hasScripture} onChange={setHasScripture}>
                                        <Checkbox.Content>
                                            <Checkbox.Control>
                                                <Checkbox.Indicator />
                                            </Checkbox.Control>
                                            Escriturado
                                        </Checkbox.Content>
                                    </Checkbox>

                                    <div className="flex justify-between pt-2">
                                        <Button type="submit" className="w-[45%]">
                                            Salvar
                                        </Button>

                                        <Button
                                            variant="danger"
                                            className="w-[45%]"
                                            onPress={resetForm}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
            {errorMessage && (
                <Alert status="danger" className="fixed bottom-4 left-1/2 z-[60] w-full max-w-md -translate-x-1/2">
                    <Alert.Content>
                        <Alert.Title>{errorMessage}</Alert.Title>
                    </Alert.Content>
                </Alert>
            )}
        </>
    );
}
