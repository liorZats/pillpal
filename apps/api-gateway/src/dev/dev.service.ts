import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DevService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    // Seed supplements
    const supplements = [
      {
        id: 'vitamin-d3',
        name: 'Vitamin D3',
        dailyDoses: [{ amount: 5000, unit: 'IU' }],
        withFood: true,
      },
      {
        id: 'b-complex',
        name: 'B-Complex',
        dailyDoses: [{ amount: 100, unit: 'MG' }],
        timing: 'AM',
      },
      {
        id: 'omega-3',
        name: 'Omega-3 Fish Oil',
        dailyDoses: [{ amount: 1000, unit: 'MG' }],
        withFood: true,
      },
      {
        id: 'magnesium',
        name: 'Magnesium Glycinate',
        dailyDoses: [{ amount: 400, unit: 'MG' }],
        timing: 'PM',
      },
      {
        id: 'iron',
        name: 'Iron',
        dailyDoses: [{ amount: 65, unit: 'MG' }],
        withFood: false,
      },
      // Add more supplements...
    ];

    await this.prisma.supplement.createMany({
      data: supplements,
      skipDuplicates: true,
    });

    // Seed knowledge base snippets
    const snippets = [
      {
        id: 'FAT_SOLUBLE_WITH_FOOD',
        content: 'Fat-soluble vitamins (A, D, E, K) are best absorbed when taken with meals containing healthy fats.',
        type: 'WITH_FOOD',
        tags: ['vitamin-d3'],
      },
      {
        id: 'IRON_AWAY_FROM_CALCIUM',
        content: 'Iron absorption is inhibited by calcium. Take iron supplements at least 2 hours apart from calcium-rich foods or supplements.',
        type: 'AVOID_CONFLICT',
        tags: ['iron', 'calcium'],
      },
      {
        id: 'MAGNESIUM_PM',
        content: 'Magnesium can promote relaxation and better sleep when taken in the evening.',
        type: 'EVENING',
        tags: ['magnesium'],
      },
      // Add more snippets...
    ];

    await this.prisma.knowledgeBaseSnippet.createMany({
      data: snippets,
      skipDuplicates: true,
    });
  }
}
