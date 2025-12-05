import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import List from '../components/List';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

const BoardPage = () => {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [newListTitle, setNewListTitle] = useState('');
    const [loading, setLoading] = useState(true);
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

    const handleAddList = async (e) => {
        e.preventDefault();
        if (!newListTitle) return;

        try {
            const { data } = await axios.post(`/boards/${id}/lists`, { title: newListTitle });
            setBoard(data);
            setNewListTitle('');
        } catch (error) {
            alert('Error creating list');
        }
    };

    const handleDeleteList = async (listId) => {
        if (!window.confirm('Delete this list and all tasks?')) return;
        
        try {
            const newLists = board.lists.filter(list => list._id !== listId);
            setBoard({ ...board, lists: newLists });
            await axios.delete(`/boards/${board._id}/lists/${listId}`);
        } catch (error) {
            const { data } = await axios.get(`/boards/${id}`);
            setBoard(data);
        }
    };

    const handleDeleteTask = async (listId, taskId) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            const { data } = await axios.delete(`/boards/${board._id}/lists/${listId}/tasks/${taskId}`);
            setBoard(data);
        } catch (error) {
            alert('Error deleting task');
        }
    };

    const refreshBoard = (updatedBoardData) => {
        setBoard(updatedBoardData);
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'LIST') {
            const newLists = Array.from(board.lists);
            const [movedList] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, movedList);

            setBoard({ ...board, lists: newLists });

            try {
                await axios.put(`/boards/${id}/reorder-lists`, { newListsArray: newLists });
            } catch (error) {
                console.error(error);
            }
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

            try {
                await axios.put(`/boards/${id}/lists/${sourceList._id}/reorder`, { newTasksArray: newTasks });
            } catch (error) { console.error(error); }

        } else {
            const newSourceTasks = Array.from(sourceList.tasks);
            newSourceTasks.splice(source.index, 1);
            
            const newDestTasks = Array.from(destList.tasks);
            newDestTasks.splice(destination.index, 0, taskToMove);

            sourceList.tasks = newSourceTasks;
            destList.tasks = newDestTasks;

            setBoard(newBoardData);

            try {
                await axios.put(`/boards/${id}/lists/${sourceList._id}/reorder`, { newTasksArray: newSourceTasks });
                await axios.put(`/boards/${id}/lists/${destList._id}/reorder`, { newTasksArray: newDestTasks });
            } catch (error) { console.error(error); }
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ height: '100vh', background: '#0079bf', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '15px', background: 'rgba(0,0,0,0.15)', color: 'white', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>
                        ← Back
                    </button>
                    <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{board.title}</h1>
                </div>

                <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ 
                                flex: 1, 
                                display: 'flex', 
                                overflowX: 'auto', 
                                padding: '20px', 
                                alignItems: 'flex-start' 
                            }}
                        >
                            {board.lists && board.lists.map((list, index) => (
                                <List 
                                    key={list._id} 
                                    list={list} 
                                    boardId={id} 
                                    index={index}
                                    onUpdate={refreshBoard}
                                    onDeleteTask={handleDeleteTask}
                                    onDeleteList={handleDeleteList}
                                />
                            ))}
                            {provided.placeholder}

                            <div style={{ minWidth: '272px', background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '3px', marginLeft: '10px' }}>
                                <form onSubmit={handleAddList}>
                                    <input 
                                        type="text" 
                                        placeholder="New list..." 
                                        value={newListTitle}
                                        onChange={(e) => setNewListTitle(e.target.value)}
                                        style={{ width: '100%', padding: '8px', marginBottom: '5px', borderRadius: '3px', border: 'none', boxSizing: 'border-box' }}
                                    />
                                    <button type="submit" style={{ background: '#4bbf6b', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '3px' }}>
                                        Add
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

export default BoardPage;