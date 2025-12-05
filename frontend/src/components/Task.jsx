import { Draggable } from '@hello-pangea/dnd';

const Task = ({ task, index, onClick }) => {

    const getBackgroundColor = (isDragging, dueDate) => {
        if (isDragging) return '#e6fcff';

        if (!dueDate) return 'white';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        if (due < today) {
            return '#ffe6e6';
        }
        if (due.getTime() === today.getTime()) {
            return '#fff8c4'; 
        }

        return 'white';
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="hover-container"
                    onClick={onClick}
                    style={{
                        background: getBackgroundColor(snapshot.isDragging, task.dueDate),
                        
                        padding: '10px 12px',
                        borderRadius: '6px',
                        boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#172b4d',
                        display: 'block',
                        border: '1px solid transparent',
                        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer',
                        ...provided.draggableProps.style,
                    }}
                >
                    <span style={{ wordBreak: 'break-word', lineHeight: '1.5' }}>
                        {task.title}
                    </span>
                    
                    {task.dueDate && (
                        <div style={{ 
                            fontSize: '11px', 
                            marginTop: '5px', 
                            color: new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) ? '#d32f2f' : '#5e6c84',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            🕒 {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default Task;