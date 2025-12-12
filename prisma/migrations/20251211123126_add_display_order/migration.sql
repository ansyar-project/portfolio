-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;
