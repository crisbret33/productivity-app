import { useState } from 'react';
import axios from '../api/axios';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task';

const List = ({ list, boardId, onUpdate, index, onDeleteList, onTaskClick }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim()) return;
        try {
            const { data } = await axios.post(`/boards/${boardId}/lists/${list._id}/tasks`, { title: taskTitle });
            onUpdate(data);
            setTaskTitle('');
            setIsAdding(false);
        } catch (error) {
            alert('Error adding task');
        }
    };

    return (
        <Draggable draggableId={list._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="hover-container"
                    style={{ 
                        minWidth: '280px',
                        width: '280px',
                        background: '#f1f2f4',
                        borderRadius: '12px',
                        padding: '12px',
                        color: '#172b4d',
                        alignSelf: 'flex-start',
                        display: 'flex',
                        flexDirection: 'column',
                        marginRight: '12px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                        maxHeight: '100%',
                        ...provided.draggableProps.style
                    }}
                >
                    {/* HEADER */}
                    <div 
                        {...provided.dragHandleProps}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', cursor: 'grab' }}
                    >
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', paddingLeft: '4px' }}>{list.title}</h3>
                        
                        <button 
                            onClick={() => onDeleteList(list._id)}
                            className="hover-delete-btn"
                            style={{ background: 'transparent', border: 'none', fontSize: '14px', padding: '5px' }}
                            title="Delete list"
                        >
                            🗑️
                        </button>
                    </div>

                    <Droppable droppableId={list._id} type="TASK">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    minHeight: '20px',
                                    flexGrow: 1,
                                    background: snapshot.isDraggingOver ? 'rgba(0,0,0,0.05)' : 'transparent',
                                    borderRadius: '8px',
                                    transition: 'background 0.2s ease',
                                    padding: '4px',
                                    overflowY: 'auto'
                                }}
                            >
                                {list.tasks.map((task, index) => (
                                    <Task 
                                        key={task._id} 
                                        task={task} 
                                        index={index} 
                                        onClick={() => onTaskClick(task, list._id)}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {isAdding ? (
                         <form onSubmit={handleAddTask} style={{ marginTop: '10px', padding: '0 4px' }}>
                             <textarea 
                                 autoFocus
                                 placeholder="Task title..."
                                 value={taskTitle}
                                 onChange={(e) => setTaskTitle(e.target.value)}
                                 onKeyDown={(e) => {
                                     if(e.key === 'Enter' && !e.shiftKey) {
                                         e.preventDefault();
                                         handleAddTask(e);
                                     }
                                 }}
                                 style={{ width: '100%', padding: '8px', resize: 'none', borderRadius: '6px', border: 'none', marginBottom: '8px', boxSizing: 'border-box', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                             />
                             <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                 <button type="submit" style={{ background: '#0079bf', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Add</button>
                                 <button type="button" onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#6b778c', padding: '4px' }}>×</button>
                             </div>
                         </form>
                    ) : (
                        <button onClick={() => setIsAdding(true)} style={{ width: '100%', padding: '10px 8px', marginTop: '8px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#5e6c84', textAlign: 'left', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                           <span>+</span> Add a card
                        </button>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default List;