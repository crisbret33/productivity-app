import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CreateBoardModal from '../components/CreateBoardModal';

const DashboardPage = () => {
    const [boards, setBoards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await axios.get('/boards');
                setBoards(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchBoards();
    }, [navigate]);

    const handleCreateBoard = async (title, initialLists) => {
        try {
            const response = await axios.post('/boards', { title, initialLists });
            setBoards([...boards, response.data]);
        } catch (error) {
            alert('Error creando tablero');
        }
    };

    const handleDeleteBoard = async (e, boardId) => {
        e.stopPropagation();
        if(!window.confirm("¿Estás segura de borrar este tablero permanentemente?")) return;
        try {
            await axios.delete(`/boards/${boardId}`);
            setBoards(boards.filter(b => b._id !== boardId));
        } catch (error) {
            alert("Error al borrar");
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        
        const items = Array.from(boards);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setBoards(items);

        try {
            const idsOnly = items.map(b => b._id);
            await axios.put('/boards/reorder-my-boards', { newOrderIds: idsOnly });
        } catch (error) {
            console.error("Error guardando orden", error);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#172b4d', fontSize: '24px', fontWeight: 'bold' }}>Hola, {user?.name} 👋</h1>
                <button onClick={logout} style={{ background: '#ff5630', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    Cerrar Sesión
                </button>
            </div>

            {/* Create new board button */}
            <div 
                onClick={() => setIsModalOpen(true)}
                style={{ 
                    marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '8px', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #dfe1e6',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafbfc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
                <div style={{ 
                    width: '40px', height: '40px', background: '#0079bf', borderRadius: '4px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' 
                }}>+</div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#172b4d' }}>Crear Nuevo Tablero</h3>
                    <p style={{ margin: 0, color: '#5e6c84', fontSize: '14px' }}>Organiza tus tareas, proyectos y más.</p>
                </div>
            </div>

            <CreateBoardModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onCreate={handleCreateBoard}
            />

            <h2 style={{ color: '#172b4d', fontSize: '16px', textTransform: 'uppercase', marginBottom: '20px' }}>Mis Tableros</h2>
            
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="dashboard-boards" direction="horizontal">
                    {(provided) => (
                        <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
                        >
                            {boards.map((board, index) => (
                                <Draggable key={board._id} draggableId={board._id} index={index}>
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => navigate(`/board/${board._id}`)}
                                            className="hover-container"
                                            style={{ 
                                                border: 'none', 
                                                padding: '16px', 
                                                width: '200px', 
                                                height: '100px',
                                                borderRadius: '8px', 
                                                boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                background: 'linear-gradient(135deg, #4b91c5 0%, #0079bf 100%)',
                                                color: 'white',
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                transition: 'transform 0.2s',
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{board.title}</h3>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>
                                                    {new Date(board.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            
                                            {/* Erase board button */}
                                            <button
                                                onClick={(e) => handleDeleteBoard(e, board._id)}
                                                className="hover-delete-btn"
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: 'rgba(255,255,255,0.2)', 
                                                    border: 'none',
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '24px',
                                                    height: '24px'
                                                }}
                                                title="Borrar tablero"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {boards.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#5e6c84', background: '#f4f5f7', borderRadius: '8px' }}>
                    <p>No tienes tableros creados. ¡Empieza creando uno arriba!</p>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;