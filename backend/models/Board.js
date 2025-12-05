const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- 1. Definición del Esquema de Comentarios (Sub-esquema) ---
const commentSchema = new Schema({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

// --- 2. Definición del Esquema de Tareas (Sub-esquema) ---
const taskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dueDate: { type: Date, default: null },
    order: { type: Number, required: true }, // Posición dentro de la lista
    comments: [commentSchema]
}, { _id: true }); // Mongoose añade un _id a cada elemento del array por defecto

// --- 3. Definición del Esquema de Listas (Sub-esquema) ---
const listSchema = new Schema({
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true }, // Posición dentro del tablero
    tasks: [taskSchema]
}, { _id: true });

// --- 4. Definición del Esquema de Miembros (Sub-esquema) ---
const memberSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor' }
}, { _id: false });

// --- 5. Definición del Esquema Principal de Tableros ---
const boardSchema = new Schema({
    title: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema], // Usuarios que tienen acceso al tablero
    lists: [listSchema] // El array de las listas (columnas)
}, {
    timestamps: true // Añade createdAt y updatedAt
});

module.exports = mongoose.model('Board', boardSchema);