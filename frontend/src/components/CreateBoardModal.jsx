import { useState } from 'react';

const CreateBoardModal = ({ isOpen, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [lists, setLists] = useState(['To Do', 'In Progress', 'Done']);
    const [newListInput, setNewListInput] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        onCreate(title, lists);
        
        setTitle('');
        setLists(['Pendiente', 'En Progreso', 'Terminado']);
        onClose();
    };

    const addList = (e) => {
        e.preventDefault();
        if (!newListInput.trim()) return;
        setLists([...lists, newListInput]);
        setNewListInput('');
    };

    const removeList = (indexToRemove) => {
        setLists(lists.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            
            {/* Modal */}
            <div style={{
                background: 'white', padding: '25px', borderRadius: '8px',
                width: '400px', maxWidth: '90%', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
            }} onClick={(e) => e.stopPropagation()}>
                
                <h2 style={{ marginTop: 0, color: '#333' }}>Crear Nuevo Tablero</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Title input */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título del Proyecto</label>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Ej: Rediseño Web..." 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Initial lists configuration */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Listas Iniciales</label>
                        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Añadir otra lista..." 
                                value={newListInput}
                                onChange={(e) => setNewListInput(e.target.value)}
                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button type="button" onClick={addList} style={{ background: '#eee', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>➕</button>
                        </div>

                        {/* Lists chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {lists.map((l, index) => (
                                <span key={index} style={{ 
                                    background: '#e0f0ff', color: '#0079bf', 
                                    padding: '5px 10px', borderRadius: '15px', fontSize: '12px',
                                    display: 'flex', alignItems: 'center', gap: '5px'
                                }}>
                                    {l}
                                    <span 
                                        onClick={() => removeList(index)} 
                                        style={{ cursor: 'pointer', fontWeight: 'bold', color: '#ff4d4d' }}
                                    >×</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 15px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={!title.trim()} style={{ padding: '10px 20px', background: title.trim() ? '#0079bf' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Crear Tablero
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBoardModal;