"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const bodyParser = require("body-parser");
const helmet_1 = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                connectSrc: ["'self'", 'https:', 'http:'],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: { action: 'deny' },
        noSniff: true,
        xssFilter: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }));
    app.use(bodyParser.json({ limit: '2mb' }));
    app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
    app.setGlobalPrefix('api');
    app.use('/uploads', (_req, res, next) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    });
    app.use('/api/uploads', (_req, res, next) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/api/uploads/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: false,
        },
    }));
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('CORS not allowed'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['X-Total-Count'],
        maxAge: 3600,
    });
    await app.listen(3001, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map