import { LoginForm } from "./Components/LoginForm";
import bgImage from "../../../assets/ImageImmobileLoginScreen.png";

export function LoginPage() {
    return (
        <div className="flex h-screen max-h-screen w-screen overflow-hidden m-0 p-0">
            <div className="hidden bg-gray-100 sm:block sm:w-1/2">
                <img src={bgImage} className="h-full w-full object-cover" alt="" />
            </div>
            <LoginForm />
        </div>
    )
}
