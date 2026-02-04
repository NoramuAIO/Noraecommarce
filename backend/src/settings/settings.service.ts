import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const settings = await this.prisma.settings.findMany();
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  async get(key: string) {
    const setting = await this.prisma.settings.findUnique({ where: { key } });
    return setting?.value;
  }

  async set(key: string, value: string) {
    return this.prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async setMany(settings: Record<string, string>) {
    // Filter out undefined and null values, but keep empty strings
    const validSettings = Object.entries(settings).filter(
      ([, value]) => value !== undefined && value !== null
    );
    
    const operations = validSettings.map(([key, value]) =>
      this.prisma.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );
    return this.prisma.$transaction(operations);
  }
}
