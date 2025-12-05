import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const BoardPage = () => {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [newListTitle, setNewListTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Cargar el tablero
    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const { data } = await axios.get(`/boards/${id}`);
                setBoard(data);
                setLoading(false);
            } catch (error) {
                alert('Error cargando tablero');
                navigate('/dashboard');
            }
        };
        fetchBoard();
    }, [id, navigate]);

    // 2. Función para añadir lista
    const handleAddList = async (e) => {
        e.preventDefault();
        if (!newListTitle) return;

        try {
            // Hacemos POST a /boards/:id/lists
            const { data } = await axios.post(`/boards/${id}/lists`, {
                title: newListTitle
            });
            setBoard(data); // Actualizamos el estado con el tablero nuevo (que ya trae la lista)
            setNewListTitle('');
        } catch (error) {
            alert('Error creando lista');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div style={{ 
            height: '100vh', 
            background: '#0079bf', 
            display: 'flex', 
            flexDirection: 'column' 
        }}>
            {/* Cabecera */}
            <div style={{ padding: '15px', background: 'rgba(0,0,0,0.15)', color: 'white', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>
                    ← Volver
                </button>
                <h1 style={{ margin: 0, fontSize: '18px' }}>{board.title}</h1>
            </div>

            {/* Contenedor de Listas (Scroll Horizontal) */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                overflowX: 'auto', // Permite scroll horizontal
                padding: '20px',
                alignItems: 'flex-start', // Alinea las listas arriba
                gap: '15px'
            }}>
                
                {/* Mapeamos las listas existentes */}
                {board.lists && board.lists.map((list) => (
                    <div key={list._id} style={{ 
                        minWidth: '272px', 
                        background: '#ebecf0', 
                        borderRadius: '3px', 
                        padding: '10px',
                        color: 'black'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{list.title}</h3>
                        
                        {/* Aquí irán las tareas (Tasks) */}
                        <div style={{ minHeight: '20px' }}>
                            <p style={{ fontSize: '12px', color: '#888' }}>Sin tareas</p>
                        </div>

                        <button style={{ width: '100%', padding: '5px', marginTop: '10px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#5e6c84', textAlign: 'left' }}>
                            + Añadir una tarjeta
                        </button>
                    </div>
                ))}

                {/* Columna para "Añadir otra lista" */}
                <div style={{ minWidth: '272px' }}>
                    <form onSubmit={handleAddList} style={{ background: '#ebecf0', padding: '10px', borderRadius: '3px' }}>
                        <input 
                            type="text" 
                            placeholder="Introduzca el título de la lista..." 
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '5px', boxSizing: 'border-box' }}
                        />
                        <button type="submit" style={{ background: '#0079bf', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '3px' }}>
                            Añadir lista
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default BoardPage;