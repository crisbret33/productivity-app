import { useState, useEffect } from 'react';

const AVAILABLE_COLORS = [
    { color: '#61bd4f', name: 'Green' }, { color: '#f2d600', name: 'Yellow' },
    { color: '#ff9f1a', name: 'Orange' }, { color: '#eb5a46', name: 'Red' },
    { color: '#c377e0', name: 'Purple' }, { color: '#0079bf', name: 'Blue' },
];

const TaskModal = ({ isOpen, onClose, task, listName, onSave, onDelete, allLists = [], currentListId, onMove, onCreateSubtask, onTaskLinkClick }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [targetListId, setTargetListId] = useState(currentListId);
    const [selectedLabels, setSelectedLabels] = useState([]);
    
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [subtaskTargetList, setSubtaskTargetList] = useState(currentListId);

    const isNewTask = task._id === 'new';

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
            setTargetListId(currentListId);
            setSelectedLabels(task.labels || []);
            setSubtaskTargetList(currentListId);
        }
    }, [task, currentListId]);

    if (!isOpen || !task) return null;

    const getTaskDetails = (idToFind) => {
        if (!allLists || !Array.isArray(allLists)) return null;
        for (const list of allLists) {
            if (list.tasks) {
                const t = list.tasks.find(t => t._id.toString() === idToFind.toString());
                if (t) return { ...t, listId: list._id, listName: list.title };
            }
        }
        return null;
    };

    const parentTask = task.parentTaskId ? getTaskDetails(task.parentTaskId) : null;
    const childTasks = (task.subtaskIds || []).map(id => getTaskDetails(id)).filter(Boolean);

    const isSubtask = task.parentTaskId && task.parentTaskId !== null;

    const handleCreateSubtask = async (e) => {
        e.preventDefault();
        if (!newSubtaskTitle.trim()) return;
        if (onCreateSubtask) {
            await onCreateSubtask(newSubtaskTitle, subtaskTargetList);
            setNewSubtaskTitle('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(task._id, { title, description, dueDate, labels: selectedLabels });
        if (targetListId !== currentListId && !isNewTask) {
            await onMove(task._id, currentListId, targetListId);
        }
        onClose();
    };

    const toggleLabel = (c) => {
        const exists = selectedLabels.find(l => l.color === c.color);
        if (exists) setSelectedLabels(selectedLabels.filter(l => l.color !== c.color));
        else setSelectedLabels([...selectedLabels, { color: c.color, text: '' }]);
    };

    const handleDelete = () => {
        if (window.confirm('Delete this task?')) {
            onDelete(task._id);
            onClose();
        }
    };

    const creationDate = task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-US') : '-';

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }} onClick={onClose}>
            
            <div style={{
                background: 'white', padding: '30px', borderRadius: '12px',
                width: '750px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)', position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>×</button>

                <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#5e6c84' }}>
                        {isNewTask ? 'Creating in list ' : 'In list '} <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{listName}</span>
                    </p>

                    {!isNewTask && parentTask && (
                        <div style={{ marginBottom: '10px', padding: '8px', background: '#e0f0ff', borderRadius: '4px', borderLeft: '4px solid #0079bf', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '12px', color: '#0079bf', fontWeight: 'bold' }}>PARENT TASK:</span>
                            <span onClick={() => onTaskLinkClick && onTaskLinkClick(parentTask, parentTask.listId)}
                                style={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', fontSize: '14px' }}>
                                {parentTask.title}
                            </span>
                            <span style={{ fontSize: '12px', color: '#666' }}>(in {parentTask.listName})</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Task title (Required)" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus style={{ fontSize: '24px', fontWeight: 'bold', width: '100%', border: 'none', borderBottom: '2px solid transparent', padding: '5px 0', marginBottom: '20px', background: 'transparent', color: '#172b4d' }} />

                    <div style={{ display: 'flex', gap: '30px' }}>
                        <div style={{ flex: 3 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#172b4d' }}>📝 Description</label>
                            <textarea placeholder="Add description..." rows="4" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dfe1e6', background: '#fafbfc', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px', boxSizing: 'border-box', marginBottom: '20px' }} />

                            {!isNewTask && !isSubtask && (
                                <div style={{ marginTop: '30px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#172b4d' }}>⛓️ Linked Subtasks</label>
                                    
                                    {childTasks.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                                            {childTasks.map(child => (
                                                <div key={child._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'white', border: '1px solid #dfe1e6', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ color: '#5e6c84', fontSize: '12px' }}></span>
                                                        <span onClick={() => onTaskLinkClick && onTaskLinkClick(child, child.listId)} style={{ cursor: 'pointer', fontWeight: '500', color: '#172b4d' }}>{child.title}</span>
                                                    </div>
                                                    <span style={{ fontSize: '11px', background: '#dfe1e6', padding: '2px 6px', borderRadius: '4px' }}>{child.listName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', marginBottom: '10px' }}>No subtasks linked.</p>
                                    )}

                                    <div style={{ background: '#f4f5f7', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#5e6c84', marginBottom: '8px' }}>CREATE NEW SUBTASK</div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input type="text" placeholder="Subtask title..." value={newSubtaskTitle} onChange={(e) => setNewSubtaskTitle(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #dfe1e6' }} />
                                            <select value={subtaskTargetList} onChange={(e) => setSubtaskTargetList(e.target.value)} style={{ width: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #dfe1e6' }}>{allLists.map(l => <option key={l._id} value={l._id}>{l.title}</option>)}</select>
                                            <button type="button" onClick={handleCreateSubtask} style={{ background: '#0079bf', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                             <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px', color: '#5e6c84' }}>🏷️ LABELS</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {AVAILABLE_COLORS.map((c) => {
                                        const isSelected = selectedLabels.some(l => l.color === c.color);
                                        return (
                                            <div key={c.color} onClick={() => toggleLabel(c)} style={{ width: '32px', height: '24px', borderRadius: '4px', background: c.color, cursor: 'pointer', border: isSelected ? '2px solid #091e42' : '2px solid transparent', boxSizing: 'border-box', transition: 'transform 0.1s' }} />
                                        );
                                    })}
                                </div>
                            </div>

                            {!isNewTask && (
                                <div style={{ background: '#f4f5f7', padding: '10px', borderRadius: '6px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', color: '#5e6c84' }}>➡️ LIST</label>
                                    <select value={targetListId} onChange={(e) => setTargetListId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dfe1e6', background: 'white', cursor: 'pointer' }}>
                                        {allLists.map(list => <option key={list._id} value={list._id}>{list.title}</option>)}
                                    </select>
                                </div>
                            )}
                            
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', color: '#5e6c84' }}>📅 DUE DATE</label>
                                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dfe1e6', boxSizing: 'border-box' }} />
                            </div>

                            {!isNewTask && (
                                <>
                                    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '5px 0' }} />
                                    <div style={{ fontSize: '12px', color: '#888' }}>Created: {creationDate}</div>
                                    <button type="button" onClick={handleDelete} style={{ background: '#ffebe6', color: '#de350b', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginTop: 'auto', width: '100%' }}>🗑️ Delete Task</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" disabled={!title.trim()} style={{ background: title.trim() ? '#0079bf' : '#ccc', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                            {isNewTask ? 'Create Task' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;