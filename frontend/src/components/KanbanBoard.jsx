import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const statuses = ["Applied", "Interview", "Offer", "Rejected"];

function KanbanBoard({ applications, updateStatus }) {

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const appId = result.draggableId;
    const newStatus = result.destination.droppableId;

    updateStatus(appId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "16px",
        marginBottom: "30px"
      }}>
        {statuses.map(status => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: "rgba(18,18,28,0.7)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "12px",
                  minHeight: "200px"
                }}
              >
                <h4 style={{ marginBottom: "10px" }}>{status}</h4>

                {applications
                  .filter(app => app.status === status)
                  .map((app, index) => (
                    <Draggable
                      key={app.id}
                      draggableId={String(app.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: "#1f1f2e",
                            padding: "10px",
                            borderRadius: "8px",
                            marginBottom: "8px",
                            color: "#fff",
                            ...provided.draggableProps.style
                          }}
                        >
                          <strong>{app.company}</strong>
                          <div style={{ fontSize: "12px", opacity: 0.7 }}>
                            {app.role}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;