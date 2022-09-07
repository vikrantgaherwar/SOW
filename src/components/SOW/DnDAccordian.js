import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};

const DnDAccordian = ({
  id,
  sectionId,
  moveAccordian,
  findAccordian,
  children,
}) => {
  const originalIndex = findAccordian(id, sectionId)?.index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "accordian",
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveAccordian(droppedId, originalIndex, sectionId);
        }
      },
    }),
    [id, originalIndex, moveAccordian]
  );
  const [, drop] = useDrop(
    () => ({
      accept: "accordian",
      canDrop: () => false,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findAccordian(id, sectionId);
          moveAccordian(draggedId, overIndex, sectionId);
        }
      },
    }),
    [findAccordian, moveAccordian]
  );
  const opacity = isDragging ? 0.5 : 1;
  return (
    <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
      {children}
    </div>
  );
};

export default memo(DnDAccordian);
