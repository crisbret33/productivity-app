import { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, task, listName, onSave, onDelete, allLists, currentListId, onMove }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [targetListId, setTargetListId] = useState(currentListId);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
            setTargetListId(currentListId);
        }
    }, [task, currentListId]);

    if (!isOpen || !task) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await onSave(task._id, { title, description, dueDate });

        if (targetListId !== currentListId) {
            await onMove(task._id, currentListId, targetListId);
        }

        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('Delete this task?')) {
            onDelete(task._id);
            onClose();
        }
    };

    const creationDate = new Date(task.createdAt).toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000
        }} onClick={onClose}>
            
            <div style={{
                background: 'white', padding: '30px', borderRadius: '12px',
                width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)', position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666'
                }}>×</button>

                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#5e6c84' }}>
                    In list <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{listName}</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ 
                            fontSize: '24px', fontWeight: 'bold', width: '100%', border: 'none', 
                            borderBottom: '2px solid transparent', padding: '5px 0', marginBottom: '20px',
                            background: 'transparent', color: '#172b4d'
                        }}
                    />

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 3 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#172b4d' }}>
                                📝 Description
                            </label>
                            <textarea 
                                placeholder="Add a more detailed description..."
                                rows="8"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ 
                                    width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dfe1e6', 
                                    background: '#fafbfc', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            
                            <div style={{ background: '#f4f5f7', padding: '10px', borderRadius: '6px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', color: '#5e6c84' }}>
                                    ➡️ LIST
                                </label>
                                <select 
                                    value={targetListId}
                                    onChange={(e) => setTargetListId(e.target.value)}
                                    style={{ 
                                        width: '100%', padding: '8px', borderRadius: '4px', 
                                        border: '1px solid #dfe1e6', background: 'white', cursor: 'pointer' 
                                    }}
                                >
                                    {allLists.map(list => (
                                        <option key={list._id} value={list._id}>
                                            {list.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', color: '#5e6c84' }}>
                                    📅 DUE DATE
                                </label>
                                <input 
                                    type="date" 
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dfe1e6', boxSizing: 'border-box' }}
                                />
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '5px 0' }} />

                            <div style={{ fontSize: '12px', color: '#888' }}>
                                Created on:<br/> {creationDate}
                            </div>

                            <button 
                                type="button" 
                                onClick={handleDelete}
                                style={{ 
                                    background: '#ffebe6', color: '#de350b', border: 'none', 
                                    padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600',
                                    marginTop: 'auto', width: '100%'
                                }}
                            >
                                🗑️ Delete Task
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" style={{ 
                            background: '#0079bf', color: 'white', border: 'none', 
                            padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' 
                        }}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;