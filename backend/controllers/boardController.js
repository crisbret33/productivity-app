const asyncHandler = require('express-async-handler');
const Board = require('../models/Board');
const User = require('../models/User');

const getBoards = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const boards = await Board.find({
        $or: [
            { owner: req.user._id },
            { 'members.userId': req.user._id }
        ]
    });

    const sortedBoards = boards.sort((a, b) => {
        const indexA = user.boards.indexOf(a._id);
        const indexB = user.boards.indexOf(b._id);
        
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        
        return indexA - indexB;
    });

    res.status(200).json(sortedBoards);
});

const createBoard = asyncHandler(async (req, res) => {
    const { title, initialLists } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('El título es obligatorio');
    }

    let listsToCreate = [];
    if (initialLists && Array.isArray(initialLists)) {
        // Añadimos el segundo parámetro 'index' al map
        listsToCreate = initialLists.map((listTitle, index) => ({
            title: listTitle,
            tasks: [],
            order: index
        }));
    }

    const board = await Board.create({
        title,
        owner: req.user._id,
        lists: listsToCreate,
        members: []
    });

    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (!user.boards) user.boards = []; 
            user.boards.push(board._id);
            await user.save();
        }
    } catch (error) {
        console.error("Error guardando referencia en usuario:", error.message);
    }

    res.status(201).json(board);
});

const getBoard = asyncHandler(async (req, res) => {
    const board = await Board.findById(req.params.id);

    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    if (board.owner.toString() !== req.user._id.toString() && 
        !board.members.some(member => member.userId.toString() === req.user._id.toString())) {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.status(200).json(board);
});

const addList = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error('Title is required');
    }

    const board = await Board.findById(req.params.id);
    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    if (board.owner.toString() !== req.user._id.toString() && 
        !board.members.some(member => member.userId.toString() === req.user._id.toString())) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const newList = {
        title,
        tasks: [],
        order: board.lists.length
    };

    board.lists.push(newList);
    await board.save();
    res.status(200).json(board);
});

const addTask = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const { boardId, listId } = req.params;

    if (!title) {
        res.status(400);
        throw new Error('Title is required');
    }

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    const list = board.lists.id(listId);
    if (!list) {
        res.status(404);
        throw new Error('List not found');
    }

    const newTask = {
        title,
        order: list.tasks.length,
        comments: []
    };

    list.tasks.push(newTask);
    await board.save();
    res.status(200).json(board);
});

const reorderTasks = asyncHandler(async (req, res) => {
    const { boardId, listId } = req.params;
    const { newTasksArray } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    const list = board.lists.id(listId);
    if (!list) {
        res.status(404);
        throw new Error('List not found');
    }

    list.tasks = newTasksArray;
    await board.save();
    res.status(200).json(board);
});

const deleteTask = asyncHandler(async (req, res) => {
    const { boardId, listId, taskId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    const list = board.lists.id(listId);
    if (!list) {
        res.status(404);
        throw new Error('List not found');
    }

    list.tasks.pull(taskId);
    await board.save();
    res.status(200).json(board);
});

const reorderLists = asyncHandler(async (req, res) => {
    const { newListsArray } = req.body;
    const board = await Board.findById(req.params.id);

    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    board.lists = newListsArray;
    await board.save();
    res.status(200).json(board);
});

const deleteList = asyncHandler(async (req, res) => {
    const { boardId, listId } = req.params;
    const board = await Board.findById(boardId);

    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    board.lists.pull(listId);
    await board.save();
    res.status(200).json(board);
});

const deleteBoard = asyncHandler(async (req, res) => {
    const board = await Board.findById(req.params.id);
    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }
    await board.deleteOne();
    res.status(200).json({ id: req.params.id });
});

const reorderMyBoards = asyncHandler(async (req, res) => {
    const { newOrderIds } = req.body;
    const user = await User.findById(req.user._id);
    user.boards = newOrderIds;
    await user.save();
    res.status(200).json({ message: 'Order updated' });
});

module.exports = {
    getBoards,
    createBoard,
    getBoard,
    addList,
    addTask,
    reorderTasks,
    deleteTask,
    reorderLists,
    deleteList,
    deleteBoard,
    reorderMyBoards
};