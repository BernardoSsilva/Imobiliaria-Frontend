import logo from "../assets/NavBarLogo.png"

export function NavBar({ nameTitle = "" }) {
    return (
        <nav className="sticky top-0 z-30 w-full border-b border-white/10 bg-(--primary-color) shadow-md shadow-black/20">
            <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
                <img className="h-12 w-auto object-contain sm:h-14" src={logo} alt="UniImmobile" />
                {nameTitle && (
                    <h3 className="truncate text-lg font-semibold tracking-tight text-white sm:text-2xl">
                        {nameTitle}
                    </h3>
                )}
            </div>
        </nav>
    )
}
