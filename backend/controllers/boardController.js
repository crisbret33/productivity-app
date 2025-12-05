const asyncHandler = require('express-async-handler');
const Board = require('../models/Board');

// @desc    Obtener tableros del usuario logueado
// @route   GET /api/boards
// @access  Private
const getBoards = asyncHandler(async (req, res) => {
    // Busca tableros donde el usuario es dueño O miembro
    // $or es un operador de MongoDB para decir "esto O aquello"
    const boards = await Board.find({
        $or: [
            { owner: req.user._id },
            { 'members.userId': req.user._id }
        ]
    });
    res.status(200).json(boards);
});

// @desc    Crear un nuevo tablero
// @route   POST /api/boards
// @access  Private
const createBoard = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Por favor añade un título al tablero');
    }

    // Creamos el tablero asignando al "owner" el usuario que viene del token (req.user)
    const board = await Board.create({
        title,
        owner: req.user._id,
        lists: [], // Empieza vacío
        members: [] // Empieza sin otros miembros
    });

    res.status(201).json(board);
});

// @desc    Obtener un tablero por ID
// @route   GET /api/boards/:id
// @access  Private
const getBoard = asyncHandler(async (req, res) => {
    // Buscamos el tablero por ID
    const board = await Board.findById(req.params.id);

    if (!board) {
        res.status(404);
        throw new Error('Tablero no encontrado');
    }

    // Verificar que el usuario tenga permiso para verlo
    // (Debe ser el dueño O ser miembro)
    if (board.owner.toString() !== req.user._id.toString() && 
        !board.members.some(member => member.userId.toString() === req.user._id.toString())) {
        res.status(401);
        throw new Error('No autorizado para ver este tablero');
    }

    res.status(200).json(board);
});

// @desc    Añadir una lista a un tablero
// @route   POST /api/boards/:id/lists
// @access  Private
const addList = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('El título de la lista es obligatorio');
    }

    const board = await Board.findById(req.params.id);

    if (!board) {
        res.status(404);
        throw new Error('Tablero no encontrado');
    }

    // Verificar permisos (dueño o miembro)
    if (board.owner.toString() !== req.user._id.toString() && 
        !board.members.some(member => member.userId.toString() === req.user._id.toString())) {
        res.status(401);
        throw new Error('No autorizado');
    }

    // Crear la nueva lista
    const newList = {
        title,
        tasks: [], // Empieza vacía
        order: board.lists.length // La ponemos al final
    };

    // Guardar en el array del tablero
    board.lists.push(newList);
    await board.save();

    res.status(200).json(board); // Devolvemos el tablero actualizado completo
});

module.exports = {
    getBoards,
    createBoard,
    getBoard,
    addList,
};