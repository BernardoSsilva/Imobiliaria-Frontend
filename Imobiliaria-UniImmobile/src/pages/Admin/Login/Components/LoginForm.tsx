import { Alert, Button, Input, InputGroup, Label, TextField } from "@heroui/react"
import type { AxiosResponse } from "axios"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import logo from "../../../../assets/ApplicationLogo.png"
import { LoadingOverlay } from "../../../../components/LoadingOverlay"
import { UserServices } from "../../../../services/user-services"

export function LoginForm() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const services = new UserServices();
    const [isLoading, setIsLoading] = useState(false);


    async function executeLogin() {
        setIsLoading(true);

        try {
            const response: AxiosResponse = await services.userLogin({ Email: email, Password: password });

            if (response.status === 200)
                navigate("/admin/pages");

            localStorage.setItem("token", response.data)
        } catch (error) {
            if ((error as AxiosResponse).status == 401)
                setErrorMessage("Credenciais inválidas!");
            else if ((error as AxiosResponse).status !== 200)
                setErrorMessage("Ocorreu um erro ao realizar Login, tente novamente mais tarde");
            else
                setErrorMessage("Erro de conexão com o servidor");
        } finally {
            setIsLoading(false);
        }

        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)

    }

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <LoadingOverlay open={isLoading} label="Processando dados" />

            <div className="flex w-full flex-col items-center justify-center px-6 py-10 sm:w-1/2">

                <form
                    className="flex w-full max-w-sm flex-col items-center gap-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        executeLogin();
                    }}
                >
                    <img className="w-28" src={logo} alt="Logo da aplicação" />

                    <TextField
                        className="w-full"
                        isRequired
                        type="email"
                        value={email}
                        onChange={setEmail}
                    >
                        <Label>Informe seu email</Label>
                        <Input placeholder="voce@email.com" />
                    </TextField>

                    <TextField className="w-full" isRequired value={password} onChange={setPassword}>
                        <Label>Senha</Label>
                        <InputGroup>
                            <InputGroup.Input type={showPassword ? "text" : "password"} placeholder="Digite sua senha" />
                            <InputGroup.Suffix>
                                <Button
                                    isIconOnly
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => setShowPassword((show) => !show)}
                                    aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                            </InputGroup.Suffix>
                        </InputGroup>
                    </TextField>

                    <Button type="submit" fullWidth className="mt-2">
                        Realizar login
                    </Button>
                </form>

                <h2 className="mt-20 text-center font-semibold text-(--primary-color)">
                    SUA SATISFAÇÃO É O NOSSO LEMA!
                </h2>

                {errorMessage && (
                    <Alert status="danger" className="mt-6 w-full max-w-sm">
                        <Alert.Content>
                            <Alert.Title>{errorMessage}</Alert.Title>
                        </Alert.Content>
                    </Alert>
                )}
            </div>
        </>
    )
}
