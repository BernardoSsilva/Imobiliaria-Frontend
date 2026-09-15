import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import type { ImageEntity } from "../../../../models/image";

interface ImageSliderProps {
    images: ImageEntity[];
}

export function ImageSlider({ images }: ImageSliderProps) {
    const [current, setCurrent] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <img
                src="/fallback.jpg"
                alt="Imagem não disponível"
                className="h-80 w-full rounded-xl object-cover shadow-md"
            />
        );
    }

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-md sm:h-96">
                <img
                    src={images[current].imageUrl}
                    alt={`Imagem ${current + 1}`}
                    className="h-full w-full cursor-pointer object-cover"
                    onClick={() => setFullscreen(true)}
                />

                <Button
                    isIconOnly
                    variant="secondary"
                    onPress={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                    <ChevronLeft />
                </Button>

                <Button
                    isIconOnly
                    variant="secondary"
                    onPress={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                    <ChevronRight />
                </Button>

                <div className="absolute bottom-4 flex w-full justify-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-2.5 w-2.5 rounded-full transition-all ${index === current ? "w-6 bg-white" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {fullscreen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                    <Button
                        isIconOnly
                        variant="ghost"
                        onPress={() => setFullscreen(false)}
                        className="absolute top-4 right-4 text-white"
                    >
                        <X size={28} />
                    </Button>
                    <img
                        src={images[current].imageUrl}
                        alt={`Imagem ampliada ${current + 1}`}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            )}
        </>
    );
}
