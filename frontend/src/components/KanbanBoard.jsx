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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        {statuses.map((status) => {
          const apps = applications.filter((app) => app.status === status);

          return (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "12px",
                    minHeight: "220px",
                  }}
                >
                  {/* Column Header */}
                  <h4
                    style={{
                      marginBottom: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                    }}
                  >
                    {status}

                    <span
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        fontSize: "11px",
                      }}
                    >
                      {apps.length}
                    </span>
                  </h4>

                  {apps.map((app, index) => (
                    <Draggable
                      key={app.id}
                      draggableId={String(app.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-3px)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 20px rgba(0,0,0,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(0px)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(10px)",
                            padding: "12px",
                            borderRadius: "10px",
                            marginBottom: "10px",
                            color: "#fff",
                            cursor: "grab",
                            transition: "all 0.25s ease",

                            boxShadow: snapshot.isDragging
                              ? "0 10px 30px rgba(99,102,241,0.4)"
                              : "none",

                            borderLeft: `4px solid ${
                              app.status === "Applied"
                                ? "#6366f1"
                                : app.status === "Interview"
                                ? "#f59e0b"
                                : app.status === "Offer"
                                ? "#10b981"
                                : "#ef4444"
                            }`,

                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{app.company}</strong>

                          <div
                            style={{
                              fontSize: "12px",
                              opacity: 0.7,
                            }}
                          >
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
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;