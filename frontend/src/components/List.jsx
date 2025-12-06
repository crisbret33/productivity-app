import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task';

const List = ({ list, boardId, onUpdate, index, onDeleteList, onTaskClick, allLists, onAddClick }) => {
    
    const getParentName = (parentId) => {
        if (!parentId || !allLists) return null;
        for (const l of allLists) {
            const t = l.tasks.find(task => task._id.toString() === parentId.toString());
            if (t) return t.title;
        }
        return 'Parent';
    };

    return (
        <Draggable draggableId={list._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="hover-container"
                    style={{ 
                        minWidth: '280px', width: '280px', background: '#f1f2f4', borderRadius: '12px',
                        padding: '12px', color: '#172b4d', alignSelf: 'flex-start', display: 'flex',
                        flexDirection: 'column', marginRight: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', maxHeight: '100%',
                        ...provided.draggableProps.style
                    }}
                >
                    <div 
                        {...provided.dragHandleProps}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', cursor: 'grab' }}
                    >
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', paddingLeft: '4px' }}>{list.title}</h3>
                        <button onClick={() => onDeleteList(list._id)} className="hover-delete-btn" style={{ background: 'transparent', border: 'none', fontSize: '14px' }} title="Delete list">🗑️</button>
                    </div>

                    <Droppable droppableId={list._id} type="TASK">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    minHeight: '20px', flexGrow: 1, background: snapshot.isDraggingOver ? 'rgba(0,0,0,0.05)' : 'transparent',
                                    borderRadius: '8px', transition: 'background 0.2s ease', padding: '4px', overflowY: 'auto'
                                }}
                            >
                                {list.tasks.map((task, index) => (
                                    <Task 
                                        key={task._id} task={task} index={index}
                                        onClick={() => onTaskClick(task, list._id)}
                                        parentName={task.parentTaskId ? getParentName(task.parentTaskId) : null}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <button 
                        onClick={() => onAddClick(list._id)} 
                        style={{ 
                            width: '100%', padding: '10px 8px', marginTop: '8px', cursor: 'pointer', 
                            background: 'transparent', border: 'none', color: '#5e6c84', textAlign: 'left', 
                            borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' 
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(9,30,66,0.08)'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                       <span>+</span> Add task
                    </button>
                </div>
            )}
        </Draggable>
    );
};

export default List;