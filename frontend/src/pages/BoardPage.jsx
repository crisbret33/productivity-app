import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import List from '../components/List';
import TaskModal from '../components/TaskModal';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

const BoardPage = () => {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [newListTitle, setNewListTitle] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedListId, setSelectedListId] = useState(null);
    const [taskHistory, setTaskHistory] = useState([]);
    const [taskDrafts, setTaskDrafts] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const { data } = await axios.get(`/boards/${id}`);
                setBoard(data);
                setLoading(false);
            } catch (error) {
                navigate('/dashboard');
            }
        };
        fetchBoard();
    }, [id, navigate]);

    const findTaskInBoard = (taskId, boardData = board) => {
        if (!boardData) return null;
        for (const list of boardData.lists) {
            const found = list.tasks.find(t => t._id === taskId);
            if (found) return { task: found, listId: list._id };
        }
        return null;
    };

    const handleUpdateDraft = (taskId, field, value) => {
        setTaskDrafts(prev => ({
            ...prev,
            [taskId]: { ...prev[taskId], [field]: value }
        }));
    };

    const clearDraft = (taskId) => {
        setTaskDrafts(prev => {
            const newState = { ...prev };
            delete newState[taskId];
            return newState;
        });
    };

    const handleAddList = async (e) => { e.preventDefault(); if (!newListTitle) return; try { const { data } = await axios.post(`/boards/${id}/lists`, { title: newListTitle }); setBoard(data); setNewListTitle(''); } catch (error) { alert('Error creating list'); } };
    const handleDeleteList = async (listId) => { if (!window.confirm('Delete list?')) return; try { const newLists = board.lists.filter(l => l._id !== listId); setBoard({ ...board, lists: newLists }); await axios.delete(`/boards/${board._id}/lists/${listId}`); } catch (error) { const { data } = await axios.get(`/boards/${id}`); setBoard(data); } };

    const handleOpenAddModal = (listId) => {
        setSelectedListId(listId);
        setTaskDrafts(prev => ({ ...prev, 'new': { pendingSubtasks: [] } }));
        setSelectedTask({ _id: 'new', title: '', description: '', labels: [], subtasks: [], dueDate: null });
        setTaskHistory([{ taskId: 'new', listId }]);
    };

    const handleCloseModal = () => {
        if (taskHistory.length > 1) {
            const newHistory = taskHistory.slice(0, -1);
            setTaskHistory(newHistory);
            const prevItem = newHistory[newHistory.length - 1];
            
            // Si el anterior era una tarea temporal, la recuperamos del padre
            if (prevItem.taskId.startsWith('temp-')) {
                // Esto es complejo, simplificamos volviendo al padre real
                // Buscar padre en historial (el antepenúltimo)
                // Para simplificar: solo volvemos a tareas reales o 'new'
            }

            const found = findTaskInBoard(prevItem.taskId);
            if (found) {
                setSelectedTask(found.task);
                setSelectedListId(found.listId);
            } else if (prevItem.taskId === 'new') {
                // Volver a la tarea nueva si estábamos editando un hijo suyo
                setSelectedTask(prevItem.taskObj); // Necesitamos guardar el objeto en historial para esto
            } else {
                setSelectedTask(null);
                setTaskHistory([]);
            }
        } else {
            setSelectedTask(null);
            setTaskHistory([]);
        }
    };

    const handleCreateTaskFromModal = async (dummyId, taskData) => {
        try {
            const { data } = await axios.post(`/boards/${board._id}/lists/${selectedListId}/tasks`, {
                title: taskData.title,
                description: taskData.description,
                dueDate: taskData.dueDate,
                labels: taskData.labels,
            });
            setBoard(data);
            clearDraft('new');

            const list = data.lists.find(l => l._id === selectedListId);
            const createdTask = list.tasks[list.tasks.length - 1];
            
            setTaskHistory(prev => {
                const newHist = [...prev];
                newHist[newHist.length - 1].taskId = createdTask._id;
                return newHist;
            });
            
            handleCloseModal(); 
            return createdTask._id; 
        } catch (error) {
            alert('Error creating task');
            return null;
        }
    };

    const handleUpdateTask = async (taskId, updatedFields) => {
        // CASO ESPECIAL: ACTUALIZAR TAREA TEMPORAL (EN MEMORIA)
        if (taskId.toString().startsWith('temp-')) {
            // Tenemos que encontrar al padre de esta tarea temporal para actualizar su borrador
            // Buscamos en todos los drafts cuál contiene esta tarea pendiente
            let parentTaskId = null;
            let parentDraft = null;

            Object.keys(taskDrafts).forEach(pId => {
                const pending = taskDrafts[pId]?.pendingSubtasks || [];
                if (pending.find(s => s._id === taskId)) {
                    parentTaskId = pId;
                    parentDraft = pending;
                }
            });

            if (parentTaskId) {
                const newPending = parentDraft.map(s => 
                    s._id === taskId ? { ...s, ...updatedFields } : s
                );
                handleUpdateDraft(parentTaskId, 'pendingSubtasks', newPending);
                handleCloseModal(); // Volvemos al padre
            }
            return taskId;
        }

        // CASO NORMAL: ACTUALIZAR EN BACKEND
        try {
            const { data } = await axios.put(
                `/boards/${board._id}/lists/${selectedListId}/tasks/${taskId}`, 
                updatedFields
            );
            setBoard(data);
            clearDraft(taskId);
            
            // Refrescar vista actual si seguimos en la misma tarea
            const found = findTaskInBoard(taskId, data);
            if (found) setSelectedTask(found.task);
            
            return taskId;
        } catch (error) {
            alert('Error updating task');
            return null;
        }
    };

    const handleTaskLinkClick = (task, listId) => {
        setSelectedTask(task);
        setSelectedListId(listId);
        
        // Guardamos el objeto completo si es temp o new para poder volver
        setTaskHistory(prev => [...prev, { taskId: task._id, listId, taskObj: task }]);
    };

    const onTaskClick = (task, listId) => {
        setSelectedTask(task);
        setSelectedListId(listId);
        setTaskHistory([{ taskId: task._id, listId, taskObj: task }]);
    };

    // FUNCIÓN POTENCIADA: Acepta objeto completo de subtarea
    const handleCreateLinkedSubtask = async (subtaskObjOrTitle, targetListId, explicitParentId) => {
        try {
            const parentId = explicitParentId || selectedTask._id;
            
            // Si el primer argumento es un objeto (viene de temp), usamos sus datos
            const payload = typeof subtaskObjOrTitle === 'object' 
                ? {
                    title: subtaskObjOrTitle.title,
                    targetListId: subtaskObjOrTitle.targetListId,
                    description: subtaskObjOrTitle.description,
                    dueDate: subtaskObjOrTitle.dueDate,
                    labels: subtaskObjOrTitle.labels
                  }
                : {
                    title: subtaskObjOrTitle,
                    targetListId: targetListId
                  };

            // Usamos el endpoint de crear tarea normal (para soportar description etc) + vinculación manual
            // Pero nuestro endpoint especial 'createLinkedSubtask' en backend NO soporta descripción aún.
            // Para simplificar, usaremos el endpoint existente y si tiene datos extra, hacemos un update después.
            // O mejor: modificamos createLinkedSubtask en backend? No, vamos a usar lo que tenemos.
            
            // 1. Crear vinculada básica
            const { data } = await axios.post(`/boards/${board._id}/tasks/${parentId}/subtasks`, payload);
            
            // 2. Si tenía datos extra (descripción...), la buscamos y la actualizamos
            if (typeof subtaskObjOrTitle === 'object' && (subtaskObjOrTitle.description || subtaskObjOrTitle.dueDate)) {
                // Buscamos la tarea recién creada (última de la lista destino)
                const targetList = data.lists.find(l => l._id === payload.targetListId);
                const createdTask = targetList.tasks[targetList.tasks.length - 1];
                
                await axios.put(`/boards/${board._id}/lists/${payload.targetListId}/tasks/${createdTask._id}`, {
                    description: subtaskObjOrTitle.description,
                    dueDate: subtaskObjOrTitle.dueDate,
                    labels: subtaskObjOrTitle.labels
                });
                
                // Recargamos tablero final
                const res = await axios.get(`/boards/${id}`);
                setBoard(res.data);
            } else {
                setBoard(data);
            }

            // Refrescar tarea actual si es el padre
            const current = findTaskInBoard(selectedTask._id, data); 
            // Nota: data puede estar desactualizado si hicimos el put extra, mejor no refrescar selectedTask aquí si ya cerramos modal
            
        } catch (error) {
            console.error(error);
            alert('Error creating subtask');
        }
    };

    const handleDeleteTaskFromModal = async (t) => { try { const { data } = await axios.delete(`/boards/${board._id}/lists/${selectedListId}/tasks/${t}`); setBoard(data); handleCloseModal(); } catch (e) { alert('Error deleting'); } };
    const handleMoveTask = async (t, c, n) => { try { const { data } = await axios.put(`/boards/${board._id}/tasks/${t}/move`, { currentListId: c, newListId: n }); setBoard(data); handleCloseModal(); } catch (e) { alert('Error moving'); } };
    const refreshBoard = (d) => setBoard(d);
    const onDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        if (type === 'LIST') {
            const newLists = Array.from(board.lists);
            const [movedList] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, movedList);
            setBoard({ ...board, lists: newLists });
            try { await axios.put(`/boards/${id}/reorder-lists`, { newListsArray: newLists }); } catch (e) {}
            return;
        }
        const newBoardData = { ...board };
        const sourceList = newBoardData.lists.find(list => list._id === source.droppableId);
        const destList = newBoardData.lists.find(list => list._id === destination.droppableId);
        const taskToMove = sourceList.tasks.find(task => task._id === draggableId);
        if (sourceList === destList) {
            const newTasks = Array.from(sourceList.tasks);
            newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, taskToMove);
            sourceList.tasks = newTasks;
            setBoard(newBoardData);
            try { await axios.put(`/boards/${id}/lists/${sourceList._id}/reorder`, { newTasksArray: newTasks }); } catch (e) {}
        } else {
            const newSourceTasks = Array.from(sourceList.tasks);
            newSourceTasks.splice(source.index, 1);
            const newDestTasks = Array.from(destList.tasks);
            newDestTasks.splice(destination.index, 0, taskToMove);
            sourceList.tasks = newSourceTasks;
            destList.tasks = newDestTasks;
            setBoard(newBoardData);
            try { await axios.put(`/boards/${id}/lists/${sourceList._id}/reorder`, { newTasksArray: newSourceTasks }); await axios.put(`/boards/${id}/lists/${destList._id}/reorder`, { newTasksArray: newDestTasks }); } catch (e) {}
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ height: '100vh', background: '#0079bf', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '15px', background: 'rgba(0,0,0,0.15)', color: 'white', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>← Back</button>
                    <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{board.title}</h1>
                </div>

                <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1, display: 'flex', overflowX: 'auto', padding: '20px', alignItems: 'flex-start' }}>
                            {board.lists && board.lists.map((list, index) => (
                                <List 
                                    key={list._id} list={list} boardId={id} index={index}
                                    onUpdate={refreshBoard} onDeleteList={handleDeleteList} onTaskClick={onTaskClick} onAddClick={handleOpenAddModal}
                                    allLists={board.lists}
                                />
                            ))}
                            {provided.placeholder}
                            <div style={{ minWidth: '272px', background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '3px', marginLeft: '10px' }}>
                                <form onSubmit={handleAddList}>
                                    <input type="text" placeholder="New list..." value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '5px', borderRadius: '3px', border: 'none', boxSizing: 'border-box' }} />
                                    <button type="submit" style={{ background: '#4bbf6b', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '3px' }}>Add</button>
                                </form>
                            </div>
                        </div>
                    )}
                </Droppable>

                {selectedTask && (
                    <TaskModal 
                        isOpen={!!selectedTask}
                        onClose={handleCloseModal}
                        task={selectedTask}
                        listName={board.lists.find(l => l._id === selectedListId)?.title || selectedTask.listName}
                        onSave={selectedTask._id === 'new' ? handleCreateTaskFromModal : handleUpdateTask}
                        onDelete={handleDeleteTaskFromModal}
                        allLists={board.lists}
                        currentListId={selectedListId}
                        onMove={handleMoveTask}
                        onCreateSubtask={handleCreateLinkedSubtask}
                        onTaskLinkClick={handleTaskLinkClick}
                        canGoBack={taskHistory.length > 1}
                        draft={taskDrafts[selectedTask._id]}
                        onUpdateDraft={handleUpdateDraft}
                    />
                )}
            </div>
        </DragDropContext>
    );
};

export default BoardPage;