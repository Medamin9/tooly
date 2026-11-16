-- CreateTable
CREATE TABLE IF NOT EXISTS "page_views" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "locale" TEXT DEFAULT 'ar',
    "visitorId" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "page_views_createdAt_idx" ON "page_views"("createdAt");
CREATE INDEX IF NOT EXISTS "page_views_path_idx" ON "page_views"("path");
CREATE INDEX IF NOT EXISTS "page_views_visitorId_idx" ON "page_views"("visitorId");

