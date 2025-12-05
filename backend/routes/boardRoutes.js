const express = require('express');
const router = express.Router();
// Importa getBoard
const { getBoards, createBoard, getBoard, addList} = require('../controllers/boardController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getBoards)
    .post(protect, createBoard);

// Añade esta línea nueva para capturar el ID
router.route('/:id').get(protect, getBoard); 
router.post('/:id/lists', protect, addList);

module.exports = router;