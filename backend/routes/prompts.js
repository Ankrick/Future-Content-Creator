const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const PromptController = require('../controllers/PromptController');


router.get('', async (req, res) => {console.log('api hit')} );
router.post('/copy', PromptController.copy);
router.post('/copy/:id', PromptController.choose);
router.post('/imageInput', (req, res, next) => {
	console.log('Route /imageInput hit');
	next();
}, upload.single('imageFile'), PromptController.imageInput);

router.post('/image', PromptController.imageGenerate);
router.post('/voice', PromptController.audio);



module.exports = router;