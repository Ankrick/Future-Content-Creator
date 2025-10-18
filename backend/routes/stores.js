const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

// Authentication re-enabled - login system is now ready
router.get('', AuthMiddleware, StoreController.index);
router.get('/:id', AuthMiddleware, StoreController.show);
router.post('/create', AuthMiddleware, StoreController.create);
router.delete('/:id', AuthMiddleware, StoreController.destory);
router.delete('/', AuthMiddleware, StoreController.destoryAll);
router.patch('/:id', AuthMiddleware, StoreController.update);





module.exports = router;