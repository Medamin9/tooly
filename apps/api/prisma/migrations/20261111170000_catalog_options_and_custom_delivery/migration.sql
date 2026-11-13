-- CreateEnum
CREATE TYPE "CatalogOptionKind" AS ENUM ('DELIVERY_METHOD', 'DURATION');

-- CreateTable
CREATE TABLE "catalog_options" (
    "id" TEXT NOT NULL,
    "kind" "CatalogOptionKind" NOT NULL,
    "code" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "labelFr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalog_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalog_options_kind_code_key" ON "catalog_options"("kind", "code");

-- CreateIndex
CREATE INDEX "catalog_options_kind_sortOrder_idx" ON "catalog_options"("kind", "sortOrder");

-- AlterTable (non-destructive forward conversion from enum to TEXT preserving all existing values)
ALTER TABLE "products"
    ALTER COLUMN "deliveryMethod" DROP DEFAULT,
    ALTER COLUMN "deliveryMethod" TYPE TEXT USING "deliveryMethod"::TEXT,
    ALTER COLUMN "deliveryMethod" SET DEFAULT 'OFFLINE_TRANSFER';

-- Seed default Delivery Methods and Durations cleanly (idempotent)
INSERT INTO "catalog_options" ("id", "kind", "code", "labelAr", "labelFr", "labelEn", "sortOrder", "createdAt", "updatedAt")
VALUES
    ('opt-deliv-offline-transfer', 'DELIVERY_METHOD', 'OFFLINE_TRANSFER', 'طلب عبر التحويل أو الدفع المحلي (تونس)', 'Commande par transfert ou virement local (Tunisie)', 'Local transfer / Tunisia manual order confirmation', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-deliv-manual-support', 'DELIVERY_METHOD', 'MANUAL_SUPPORT', 'تفعيل يدوي سريع عبر دعم Tooly.tn', 'Activation manuelle rapide via le support Tooly.tn', 'Fast manual activation via Tooly.tn support', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-deliv-team-invite', 'DELIVERY_METHOD', 'TEAM_INVITE', 'دعوة مساحة عمل رسمية على بريدك الشخصي', 'Invitation officielle sur votre e-mail personnel', 'Official workspace invite sent to your email', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-deliv-credentials', 'DELIVERY_METHOD', 'CREDENTIALS_PROVISION', 'إعداد وتسليم بيانات حساب مخصص وآمن', 'Fourniture dédiée d’identifiants sécurisés', 'Dedicated provisioned account credentials', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-deliv-voucher-code', 'DELIVERY_METHOD', 'VOUCHER_CODE', 'تسليم كود تفعيل فوري عبر البريد', 'Livraison d’un code d’activation par e-mail', 'Instant activation voucher code delivered by email', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-dur-1-month', 'DURATION', '1_month', 'شهر واحد', '1 mois', '1 month', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-dur-3-months', 'DURATION', '3_months', '3 أشهر', '3 mois', '3 months', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-dur-6-months', 'DURATION', '6_months', '6 أشهر', '6 mois', '6 months', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-dur-1-year', 'DURATION', '1_year', 'سنة كاملة', '1 an', '1 year', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('opt-dur-lifetime', 'DURATION', 'lifetime', 'مدى الحياة', 'À vie', 'Lifetime', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("kind", "code") DO NOTHING;

