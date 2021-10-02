-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "icon" TEXT NOT NULL DEFAULT E'/img/pfp.png',
    "password" TEXT NOT NULL,
    "memberPlus" BOOLEAN NOT NULL DEFAULT false,
    "documentsMade" INTEGER NOT NULL DEFAULT 0,
    "activeUnlimitedDocuments" INTEGER NOT NULL DEFAULT 0,
    "apiToken" TEXT NOT NULL,
    "discordId" TEXT,
    "githubAccess" TEXT,
    "opt" TEXT,
    "userSettingsId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "clipboard" BOOLEAN NOT NULL DEFAULT false,
    "longUrls" BOOLEAN NOT NULL DEFAULT false,
    "shortUrls" BOOLEAN NOT NULL DEFAULT false,
    "instantDelete" BOOLEAN NOT NULL DEFAULT false,
    "encrypted" BOOLEAN NOT NULL DEFAULT false,
    "imageEmbed" BOOLEAN NOT NULL DEFAULT false,
    "expiration" INTEGER NOT NULL DEFAULT 5,
    "fontLignatures" BOOLEAN NOT NULL DEFAULT false,
    "fontSize" INTEGER NOT NULL DEFAULT 14,
    "renderWhitespace" BOOLEAN NOT NULL DEFAULT false,
    "wordWrap" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "creator" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "documentSettingsId" TEXT NOT NULL,
    "gist" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "encryptedIv" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_settings" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "imageEmbed" BOOLEAN NOT NULL,
    "instantDelete" BOOLEAN NOT NULL,
    "encrypted" BOOLEAN NOT NULL,
    "public" BOOLEAN NOT NULL,
    "editors" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.apiToken_unique" ON "User"("apiToken");

-- CreateIndex
CREATE UNIQUE INDEX "Document.documentId_unique" ON "Document"("documentId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("userSettingsId") REFERENCES "user_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD FOREIGN KEY ("documentSettingsId") REFERENCES "document_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
