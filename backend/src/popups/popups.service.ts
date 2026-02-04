import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PopupsService {
  constructor(private prisma: PrismaService) {}

  async getActive() {
    return this.prisma.popupSettings.findFirst({
      where: { enabled: true },
      include: { product: true },
    })
  }

  async getAll() {
    return this.prisma.popupSettings.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    })
  }

  async getById(id: number) {
    const popup = await this.prisma.popupSettings.findUnique({
      where: { id },
      include: { product: true },
    })

    if (!popup) {
      throw new NotFoundException('Popup bulunamadı')
    }

    return popup
  }

  async create(data: {
    title: string
    description?: string
    buttonText?: string
    productId?: number
    enabled?: boolean
  }) {
    return this.prisma.popupSettings.create({
      data: {
        title: data.title,
        description: data.description,
        buttonText: data.buttonText || 'Tıkla ve Ürünü İncele!',
        productId: data.productId,
        enabled: data.enabled ?? true,
      },
      include: { product: true },
    })
  }

  async update(
    id: number,
    data: {
      title?: string
      description?: string
      buttonText?: string
      productId?: number
      enabled?: boolean
    }
  ) {
    const popup = await this.getById(id)

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
    })
  }

  async delete(id: number) {
    await this.getById(id)
    return this.prisma.popupSettings.delete({ where: { id } })
  }
}

