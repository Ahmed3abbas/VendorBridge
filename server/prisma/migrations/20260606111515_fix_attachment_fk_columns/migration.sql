/*
  Warnings:

  - You are about to drop the column `entity_id` on the `attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachment_po_fk";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachment_rfq_fk";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "entity_id",
ADD COLUMN     "po_id" TEXT,
ADD COLUMN     "rfq_id" TEXT;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
