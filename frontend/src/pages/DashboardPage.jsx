import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [boards, setBoards] = useState([]); // Guardar los tableros que vienen del backend
    const [newBoardTitle, setNewBoardTitle] = useState(''); // Para el input de crear tablero
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')); // Datos del usuario (nombre, etc)

    // 1. Cargar tableros al entrar en la página
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await axios.get('/boards');
                setBoards(response.data);
            } catch (error) {
                console.error("Error cargando tableros", error);
                // Si el token falló (ej. expiró), lo mandamos al login
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchBoards();
    }, [navigate]);

    // 2. Función para crear un tablero nuevo
    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoardTitle) return;

        try {
            const response = await axios.post('/boards', { title: newBoardTitle });
            // Añadimos el nuevo tablero a la lista que ya tenemos visualmente
            setBoards([...boards, response.data]);
            setNewBoardTitle(''); // Limpiar el input
        } catch (error) {
            alert('Error creando tablero');
        }
    };

    // 3. Función de Cerrar Sesión
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Cabecera */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Hola, {user?.name} 👋</h1>
                <button onClick={logout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>

            {/* Formulario para crear tablero */}
            <form onSubmit={handleCreateBoard} style={{ marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Nombre del nuevo tablero..." 
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Crear Tablero
                </button>
            </form>

            {/* Lista de Tableros */}
            <h2>Mis Tableros</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {boards.map((board) => (
                    <div 
                        key={board._id} 
                        onClick={() => navigate(`/board/${board._id}`)} // <--- AÑADE ESTO
                        style={{ 
                            border: '1px solid #ddd', 
                            padding: '20px', 
                            width: '200px', 
                            borderRadius: '8px', 
                            boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            background: '#f9f9f9'
                        }}
                    >
                        <h3 style={{ margin: '0 0 10px 0' }}>{board.title}</h3>
                        <p style={{ fontSize: '12px', color: '#666' }}>Creado: {new Date(board.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
                
                {boards.length === 0 && <p>No tienes tableros aún. ¡Crea el primero!</p>}
            </div>
        </div>
    );
};

export default DashboardPage;