/*
  Warnings:

  - You are about to drop the `Accessorio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Assicurazione` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bicicletta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Modello` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notifica` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prenotazione` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tipologia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AccessorioToBicicletta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bicicletta" DROP CONSTRAINT "Bicicletta_coperturaId_fkey";

-- DropForeignKey
ALTER TABLE "Bicicletta" DROP CONSTRAINT "Bicicletta_modelloId_fkey";

-- DropForeignKey
ALTER TABLE "Bicicletta" DROP CONSTRAINT "Bicicletta_tipologiaId_fkey";

-- DropForeignKey
ALTER TABLE "Notifica" DROP CONSTRAINT "Notifica_utenteId_fkey";

-- DropForeignKey
ALTER TABLE "Prenotazione" DROP CONSTRAINT "Prenotazione_biciclettaId_fkey";

-- DropForeignKey
ALTER TABLE "Prenotazione" DROP CONSTRAINT "Prenotazione_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Prenotazione" DROP CONSTRAINT "Prenotazione_utenteId_fkey";

-- DropForeignKey
ALTER TABLE "_AccessorioToBicicletta" DROP CONSTRAINT "_AccessorioToBicicletta_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccessorioToBicicletta" DROP CONSTRAINT "_AccessorioToBicicletta_B_fkey";

-- DropTable
DROP TABLE "Accessorio";

-- DropTable
DROP TABLE "Assicurazione";

-- DropTable
DROP TABLE "Bicicletta";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Modello";

-- DropTable
DROP TABLE "Notifica";

-- DropTable
DROP TABLE "Prenotazione";

-- DropTable
DROP TABLE "Tipologia";

-- DropTable
DROP TABLE "_AccessorioToBicicletta";

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nominativo" TEXT NOT NULL,
    "via" TEXT NOT NULL,
    "comune" TEXT NOT NULL,
    "paese" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatoConsegna" (
    "id" SERIAL NOT NULL,
    "descrizione" TEXT NOT NULL,

    CONSTRAINT "StatoConsegna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consegna" (
    "id" SERIAL NOT NULL,
    "chiaveConsegna" TEXT NOT NULL,
    "dataRitiro" TIMESTAMP(3) NOT NULL,
    "dataConsegna" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" INTEGER NOT NULL,
    "operatoreId" INTEGER NOT NULL,
    "statoId" INTEGER NOT NULL,

    CONSTRAINT "Consegna_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatoConsegna_descrizione_key" ON "StatoConsegna"("descrizione");

-- CreateIndex
CREATE UNIQUE INDEX "Consegna_chiaveConsegna_key" ON "Consegna"("chiaveConsegna");

-- AddForeignKey
ALTER TABLE "Consegna" ADD CONSTRAINT "Consegna_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consegna" ADD CONSTRAINT "Consegna_operatoreId_fkey" FOREIGN KEY ("operatoreId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consegna" ADD CONSTRAINT "Consegna_statoId_fkey" FOREIGN KEY ("statoId") REFERENCES "StatoConsegna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
