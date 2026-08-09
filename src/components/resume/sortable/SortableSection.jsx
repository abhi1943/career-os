import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableSection({ id, children }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (

        <div
            ref={setNodeRef}
            style={style}
            className="relative"
        >

            <div
                {...attributes}
                {...listeners}
                className="absolute right-2 top-2 cursor-move text-gray-400 hover:text-blue-600"
            >
                ☰
            </div>

            {children}

        </div>

    );

}

export default SortableSection;