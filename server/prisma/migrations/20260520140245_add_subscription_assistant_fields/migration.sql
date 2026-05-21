-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "cancelInstructions" TEXT,
ADD COLUMN     "managementUrl" TEXT,
ADD COLUMN     "plannedCancelDate" TIMESTAMP(3);
