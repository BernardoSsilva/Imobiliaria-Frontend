import { Button, Modal } from "@heroui/react"
import { Trash2, Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { LoadingOverlay } from "../../../../../../components/LoadingOverlay"
import type { ImageEntity } from "../../../../../../models/image"
import { ImageServices } from "../../../../../../services/images-services"

type Props = {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    immobileId: string | null
}

export function GalleryModal(
    {
        immobileId,
        isOpen,
        setIsOpen
    }: Props
) {

    const [imagesData, setImagesData] = useState<ImageEntity[]>([])
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const service = new ImageServices()

    const fetchImagesData = async () => {
        setIsLoading(true)

        if (!immobileId) return
        const response = await service.ListImages(immobileId)
        setImagesData(response)

        setIsLoading(false)

    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true)
        if (!immobileId || !event.target.files || event.target.files.length === 0) return

        const file = event.target.files[0]
        try {

            const formData = new FormData()
            formData.append("File", file)

            await service.UploadImage(formData, immobileId)
            await fetchImagesData()
        } catch (error) {
            console.error("Erro ao fazer upload:", error)
        } finally {
            event.target.value = ""
            setIsLoading(false)

        }
    }

    const handleDelete = async (id: string) => {
        try {
            await service.DeleteImage(id)
            await fetchImagesData()
        } catch (error) {
            console.error("Erro ao excluir imagem:", error)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchImagesData()
        }
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className="h-[70vh] w-[80vw] max-w-4xl">
                        <LoadingOverlay open={isLoading} />

                        <Modal.Header>
                            <Modal.Heading>Galeria de imagens</Modal.Heading>
                            <Modal.CloseTrigger />
                        </Modal.Header>

                        <Modal.Body className="overflow-y-auto">
                            <div className="mb-4 flex justify-end">
                                <Button variant="outline" onPress={handleUploadClick}>
                                    <Upload size={18} />
                                    Enviar Imagem
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    hidden
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {imagesData.length > 0 ? imagesData.map((item, index) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-lg"
                                    >
                                        <img
                                            className="h-40 w-full object-cover transition duration-300 group-hover:blur-sm group-hover:brightness-50"
                                            src={item.imageUrl}
                                            alt={`Imagem ${index}`}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                                            <button
                                                className="cursor-pointer rounded-full bg-red-600 p-2 shadow-lg transition hover:bg-red-700"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 size={22} color="white" />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="col-span-full py-10 text-center font-semibold text-gray-500">
                                        Nenhuma Imagem Registrada
                                    </p>
                                )}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
