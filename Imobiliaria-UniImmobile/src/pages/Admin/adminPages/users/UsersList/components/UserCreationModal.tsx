import {
    Alert,
    Button,
    Input,
    InputGroup,
    Label,
    Modal,
    TextField,
} from "@heroui/react";
import { inputVariants } from "@heroui/react/input";
import type { AxiosResponse } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { FormSelect } from "../../../../../../components/FormSelect";
import type { UserCreationDto } from "../../../../../../models/DTOs/userCreationDto";
import type { UserUpdateDto } from "../../../../../../models/DTOs/userUpdateDto";
import { UserRolesEnum } from "../../../../../../models/types/userRolesEnum";
import type { UserEntity } from "../../../../../../models/user";
import { UserServices } from "../../../../../../services/user-services";

type Props = {
    isModalOpen: boolean
    setIsModalOpen: (value: boolean) => void
    userId: string | null
    setSelectedUserId: (value: string | null) => void
}

const roleOptions = [
    { key: "ADMIN", label: "Admin" },
    { key: "OPERATOR", label: "Operador" },
];

export function UserCreationModal({ isModalOpen, setIsModalOpen, userId, setSelectedUserId }: Props) {
    const [user, setUser] = useState<UserEntity>()

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [userEmail, setUserEmail] = useState(user ? user.userEmail : "");
    const [userRole, setUserRole] = useState<UserRolesEnum>(user ? user.role : UserRolesEnum.ADMIN);
    const [userPhone, setUserPhone] = useState(user ? user.phone : "");
    const [userBornDate, setUserBornDate] = useState<Dayjs | null>(dayjs());
    const [userName, setUserName] = useState(user ? user.userName : "");
    const [userPassword, setUserPassword] = useState("");
    const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("")

    const fetchUser = async () => {
        const service = new UserServices();

        if (userId) {

            setUser((await service.findUser(userId)));
        } else {
            setUser(undefined)
        }

    }

    useEffect(() => {
        fetchUser();
    }, [isModalOpen, userId])


    useEffect(() => {
        if (user) {
            setUserEmail(user.userEmail);
            setUserRole(user.role);
            setUserPhone(user.phone);
            setUserBornDate(dayjs(user.bornDate));
            setUserName(user.userName);
        } else {
            setUserEmail("");
            setUserRole(UserRolesEnum.ADMIN);
            setUserPhone("");
            setUserBornDate(dayjs());
            setUserName("");
        }
    }, [user]);

    const validateForm = (): boolean => {
        if (!userName.trim()) {
            alert("O nome é obrigatório");
            return false;
        }
        if (!userEmail.trim()) {
            alert("O email é obrigatório");
            return false;
        }
        if (!userRole) {
            alert("O papel do usuário é obrigatório");
            return false;
        }
        if (!userPhone.trim()) {
            alert("O telefone é obrigatório");
            return false;
        }
        if (!userBornDate) {
            alert("A data de nascimento é obrigatória");
            return false;
        }

        const idade = dayjs().diff(dayjs(userBornDate), "year");
        if (idade < 18) {
            alert("O usuário deve ter pelo menos 18 anos");
            return false;
        }

        if (!userId) {
            if (userPassword.length < 8) {
                alert("A senha deve ter no mínimo 8 caracteres");
                return false;
            }
            if (userPassword !== userPasswordConfirmation) {
                alert("As senhas não coincidem");
                return false;
            }
        }

        return true;
    };


    const saveUser = async () => {
        const service = new UserServices();

        if (!validateForm()) {
            return;
        }

        if (userId) {
            if (userId) {
                try {

                    const existingUser = (await service.findUser(userId));
                    existingUser.userEmail = userEmail;
                    existingUser.role = userRole;
                    existingUser.phone = userPhone;
                    existingUser.bornDate = userBornDate!.toDate();
                    existingUser.userName = userName;

                    const data: UserUpdateDto = {
                        BornDate: existingUser.bornDate,
                        UserName: existingUser.userName,
                        Phone: existingUser.phone,
                        Role: existingUser.role == UserRolesEnum.ADMIN ? 0 : 1,
                        UserEmail: existingUser.userEmail
                    }


                    await service.updateUserData(data, userId)

                    alert("Usuário alterado com sucesso")
                } catch (error) {
                    if ((error as AxiosResponse).status == 400) {
                        setErrorMessage((error as AxiosResponse).data)
                    } else if ((error as AxiosResponse).status == 401) {
                        setErrorMessage((error as AxiosResponse).data.toString())
                    } else {
                        setErrorMessage("Erro desconhecido!")
                    }
                } finally {
                    setIsModalOpen(false);
                    setSelectedUserId(null)
                }
            }
        } else {
            try {
                const newUser: UserCreationDto = {
                    UserEmail: userEmail,
                    Role: userRole == UserRolesEnum.ADMIN ? 0 : 1,
                    Phone: userPhone,
                    BornDate: userBornDate!.toDate(),
                    UserName: userName,
                    Password: userPassword
                };

                await service.createNewUser(newUser);
                alert("Usuário criado com sucesso")

            } catch (error) {
                if ((error as AxiosResponse).status == 400) {
                    setErrorMessage((error as AxiosResponse).data)
                } else if ((error as AxiosResponse).status == 401) {
                    setErrorMessage((error as AxiosResponse).data.toString())
                } else {
                    setErrorMessage("Erro desconhecido!")
                }
            } finally {
                setIsModalOpen(false);
            }


        }
        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)

    }


    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

    return <>
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="max-h-[85vh] overflow-y-auto">
                        <Modal.Header>
                            <Modal.Heading>
                                {userId ? "Editar Usuário" : "Cadastrar Usuário"}
                            </Modal.Heading>
                            <Modal.CloseTrigger onPress={() => setIsModalOpen(false)} />
                        </Modal.Header>

                        <Modal.Body>
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    saveUser();
                                }}
                            >
                                <TextField value={userName} onChange={setUserName}>
                                    <Label>Nome</Label>
                                    <Input />
                                </TextField>

                                <TextField value={userEmail} onChange={setUserEmail} type="email">
                                    <Label>E-mail</Label>
                                    <Input />
                                </TextField>

                                <FormSelect
                                    label="Papel do Usuário"
                                    selectedKey={userRole}
                                    onSelectionChange={(key) => setUserRole(key as UserRolesEnum)}
                                    options={roleOptions}
                                />

                                <TextField value={userPhone} onChange={setUserPhone} type="tel">
                                    <Label>Telefone</Label>
                                    <Input placeholder="99 999999999" />
                                </TextField>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-foreground">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        className={inputVariants({ fullWidth: true })}
                                        value={userBornDate ? userBornDate.format("YYYY-MM-DD") : ""}
                                        onChange={(e) => setUserBornDate(e.target.value ? dayjs(e.target.value) : null)}
                                    />
                                </div>

                                {userId == null && (
                                    <>
                                        <TextField value={userPassword} onChange={setUserPassword}>
                                            <Label>Senha</Label>
                                            <InputGroup>
                                                <InputGroup.Input type={showPassword ? "text" : "password"} />
                                                <InputGroup.Suffix>
                                                    <Button
                                                        isIconOnly
                                                        variant="ghost"
                                                        size="sm"
                                                        onPress={() => setShowPassword((show) => !show)}
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </Button>
                                                </InputGroup.Suffix>
                                            </InputGroup>
                                        </TextField>

                                        <TextField value={userPasswordConfirmation} onChange={setUserPasswordConfirmation}>
                                            <Label>Confirmar senha</Label>
                                            <InputGroup>
                                                <InputGroup.Input type={showPasswordConfirmation ? "text" : "password"} />
                                                <InputGroup.Suffix>
                                                    <Button
                                                        isIconOnly
                                                        variant="ghost"
                                                        size="sm"
                                                        onPress={() => setShowPasswordConfirmation((show) => !show)}
                                                    >
                                                        {showPasswordConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </Button>
                                                </InputGroup.Suffix>
                                            </InputGroup>
                                        </TextField>
                                    </>
                                )}
                                <div className="flex justify-between pt-2">
                                    <Button type="submit" className="w-[45%]">
                                        Salvar
                                    </Button>

                                    <Button
                                        variant="danger"
                                        className="w-[45%]"
                                        onPress={() => setIsModalOpen(false)}
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
}
