
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js'
import trendsRoute from './routes/trendsRoute.js'
// import stripeRoute from './routes/stripeRoute.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
// import authenticate from './middleware/authMiddleware.js';
import bodyParser from 'body-parser';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8080;
const app = express();

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Universal Basic Resources API',
        version: '1.0.0',
        description: 'API documentation for my app',
    },
    servers: [
        {
            url: process.env.BASE_URL || `http://localhost:${PORT}`,
            description: 'API Base URL',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    // security: [
    //     {
    //         bearerAuth: [],
    //     },
    // ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './routes/*.mjs'], // path to the API route files
};

// Create swagger spec
const swaggerSpec = swaggerJsdoc(options);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static Swagger UI assets
app.use('/swagger-static', express.static(path.join(__dirname, 'node_modules', 'swagger-ui-dist')));

app.get('/', (req, res)=>{
    try {
        res.status(200).json({ message: 'Welcome to API of Universal Basic Resources'})
    } catch (error) {
        res.status(500).json({ error })
    }
})

// Serve Swagger JSON
app.get('/swagger-static/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Serve Swagger docs
app.use(
    '/docs',
    swaggerUi.serveFiles(null, { swaggerOptions: { url: '/swagger-static/swagger.json' } }),
    swaggerUi.setup(null, { swaggerOptions: { url: '/swagger-static/swagger.json' } })
);

// API routes
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute);
app.use('/api/trends', trendsRoute);
// app.use('/api/stripe', stripeRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
