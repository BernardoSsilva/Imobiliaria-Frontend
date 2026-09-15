import { ConfirmDialog } from "../../../../../../components/ConfirmDialog";
import { ImmobilesServices } from "../../../../../../services/immobiles-services";

type Props = {
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    immobileId: string | null
    setSelectedImmobileId: (value: string | null) => void

}


export function ImmobileDeleteDialog({ isOpen, setIsOpen, immobileId, setSelectedImmobileId }: Props) {

    const confirmExclusion = async () => {
        const service = new ImmobilesServices();

        await service.DeleteImmobile(immobileId ?? "");
        setIsOpen(false)
        setSelectedImmobileId(null)
    }

    return (
        <ConfirmDialog
            isOpen={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) setSelectedImmobileId(null)
            }}
            title="Confirme a exclusão"
            description="Você deseja realmente realizar a exclusão dos dados deste imóvel? Os dados não poderão ser restaurados."
            onConfirm={confirmExclusion}
        />
    )
}
