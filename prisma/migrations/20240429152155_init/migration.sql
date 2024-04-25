-- CreateTable
CREATE TABLE "WechatAccount" (
    "openid" TEXT NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "unionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WechatAccount_pkey" PRIMARY KEY ("openid")
);

-- CreateTable
CREATE TABLE "AppUser" (
    "uid" SERIAL NOT NULL,
    "mobile" TEXT,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "bcryptPassword" TEXT,
    "name" TEXT,
    "wxOpenid" TEXT,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "VerificationSms" (
    "id" SERIAL NOT NULL,
    "mobile" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VerificationSms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "messageId" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VerificationEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "uid" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_mobile_key" ON "AppUser"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_wxOpenid_key" ON "AppUser"("wxOpenid");

-- CreateIndex
CREATE INDEX "AppUser_wxOpenid_idx" ON "AppUser"("wxOpenid");

-- CreateIndex
CREATE INDEX "Todo_uid_idx" ON "Todo"("uid");
