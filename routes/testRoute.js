import { generateText } from "../controllers/test.js";
import express from 'express'
const router = express.Router()

router.get('/', generateText)

export default router