-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "desc" TEXT,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
