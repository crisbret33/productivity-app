import { Draggable } from '@hello-pangea/dnd';

const Task = ({ task, index, listId, onDelete }) => {
    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="hover-container"
                    style={{
                        background: snapshot.isDragging ? '#e6fcff' : 'white',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#172b4d',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid transparent',
                        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                        ...(snapshot.isDragging ? {} : { cursor: 'grab' }),
                        ...provided.draggableProps.style,
                    }}
                >
                    <span style={{ wordBreak: 'break-word' }}>{task.title}</span>

                    <button
                        onClick={() => onDelete(listId, task._id)}
                        className="hover-delete-btn"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '16px',
                        }}
                        title="Borrar tarea"
                    >
                        🗑️
                    </button>
                </div>
            )}
        </Draggable>
    );
};

export default Task;