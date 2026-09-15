import { ConfirmDialog } from "../../../../../../components/ConfirmDialog";
import { UserServices } from "../../../../../../services/user-services";

type Props = {
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    userId: string
    setSelectedUserId: (value: string | null) => void

}


export function UserDeleteDialog({ isOpen, setIsOpen, userId, setSelectedUserId }: Props) {

    const confirmExclusion = async () => {
        const service = new UserServices();

        await service.deleteUserData(userId);
        setIsOpen(false)
        setSelectedUserId(null)
    }

    return (
        <ConfirmDialog
            isOpen={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) setSelectedUserId(null)
            }}
            title="Confirme a exclusão"
            description="Você deseja realmente realizar a exclusão dos dados deste usuário? Os dados não poderão ser restaurados."
            onConfirm={confirmExclusion}
        />
    )
}
