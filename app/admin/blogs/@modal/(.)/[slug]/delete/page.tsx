import DeleteActionForm from "@/components/admin/DeleteActionForm";
import ModalWrapper from "@/components/ui/ModalWrapper";

export default async function DeleteProjectModal({ params }: { params: { id: string; }; }) {
    const { id } = params;
    return (
        <ModalWrapper>
            <DeleteActionForm id={id} />
        </ModalWrapper>
    );
}
