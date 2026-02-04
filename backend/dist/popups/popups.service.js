"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PopupsService = class PopupsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActive() {
        return this.prisma.popupSettings.findFirst({
            where: { enabled: true },
            include: { product: true },
        });
    }
    async getAll() {
        return this.prisma.popupSettings.findMany({
            orderBy: { createdAt: 'desc' },
            include: { product: true },
        });
    }
    async getById(id) {
        const popup = await this.prisma.popupSettings.findUnique({
            where: { id },
            include: { product: true },
        });
        if (!popup) {
            throw new common_1.NotFoundException('Popup bulunamadı');
        }
        return popup;
    }
    async create(data) {
        return this.prisma.popupSettings.create({
            data: {
                title: data.title,
                description: data.description,
                buttonText: data.buttonText || 'Tıkla ve Ürünü İncele!',
                productId: data.productId,
                enabled: data.enabled ?? true,
            },
            include: { product: true },
        });
    }
    async update(id, data) {
        const popup = await this.getById(id);
        return this.prisma.popupSettings.update({
            where: { id },
            data: {
                title: data.title ?? popup.title,
                description: data.description ?? popup.description,
                buttonText: data.buttonText ?? popup.buttonText,
                productId: data.productId ?? popup.productId,
                enabled: data.enabled ?? popup.enabled,
            },
            include: { product: true },
        });
    }
    async delete(id) {
        await this.getById(id);
        return this.prisma.popupSettings.delete({ where: { id } });
    }
};
exports.PopupsService = PopupsService;
exports.PopupsService = PopupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PopupsService);
//# sourceMappingURL=popups.service.js.map