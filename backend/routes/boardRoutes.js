const express = require('express');
const router = express.Router();
const { 
    getBoards, createBoard, getBoard, addList, addTask, 
    reorderTasks, deleteTask, reorderLists, deleteList, 
    deleteBoard, reorderMyBoards 
} = require('../controllers/boardController');
const { protect } = require('../middlewares/authMiddleware');

router.put('/reorder-my-boards', protect, reorderMyBoards);

router.route('/')
    .get(protect, getBoards)
    .post(protect, createBoard);

router.route('/:id')
    .get(protect, getBoard)
    .delete(protect, deleteBoard);

router.put('/:id/reorder-lists', protect, reorderLists);

router.post('/:id/lists', protect, addList);
router.delete('/:boardId/lists/:listId', protect, deleteList);

router.post('/:boardId/lists/:listId/tasks', protect, addTask);
router.put('/:boardId/lists/:listId/reorder', protect, reorderTasks);
router.delete('/:boardId/lists/:listId/tasks/:taskId', protect, deleteTask);

module.exports = router;