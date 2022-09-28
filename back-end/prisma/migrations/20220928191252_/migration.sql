-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT,
    "pseudo" TEXT NOT NULL,
    "isTwoFactorAuthenticationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorAuthenticationSecret" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "profileImage" TEXT,
    "legend" TEXT,
    "nbr_games" INTEGER NOT NULL DEFAULT 0,
    "nbr_wins" INTEGER NOT NULL DEFAULT 0,
    "nbr_looses" INTEGER NOT NULL DEFAULT 0,
    "goals_f" INTEGER NOT NULL DEFAULT 0,
    "goals_a" INTEGER NOT NULL DEFAULT 0,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "score_1" INTEGER NOT NULL DEFAULT 0,
    "id_1" INTEGER NOT NULL,
    "id_2" INTEGER NOT NULL,
    "score_2" INTEGER NOT NULL DEFAULT 0,
    "winner" INTEGER NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" SERIAL NOT NULL,
    "createurID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "hash" TEXT,
    "private" BOOLEAN NOT NULL,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ban" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeBan" INTEGER,
    "finshBan" INTEGER,
    "muteBan" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "bandef" BOOLEAN NOT NULL,
    "description" TEXT,
    "iduser" INTEGER NOT NULL,

    CONSTRAINT "ban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "userID1" INTEGER NOT NULL,
    "userID2" INTEGER NOT NULL,

    CONSTRAINT "mp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "userID" INTEGER,
    "destByID" INTEGER,
    "mpID" INTEGER,
    "message" TEXT NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_dem_friend" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_acce_friend" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_channeladmin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_channeluser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_channelblocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_channelban" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_mpuser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_pseudo_key" ON "user"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "channel_name_key" ON "channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_dem_friend_AB_unique" ON "_dem_friend"("A", "B");

-- CreateIndex
CREATE INDEX "_dem_friend_B_index" ON "_dem_friend"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_acce_friend_AB_unique" ON "_acce_friend"("A", "B");

-- CreateIndex
CREATE INDEX "_acce_friend_B_index" ON "_acce_friend"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channeladmin_AB_unique" ON "_channeladmin"("A", "B");

-- CreateIndex
CREATE INDEX "_channeladmin_B_index" ON "_channeladmin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channeluser_AB_unique" ON "_channeluser"("A", "B");

-- CreateIndex
CREATE INDEX "_channeluser_B_index" ON "_channeluser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channelblocked_AB_unique" ON "_channelblocked"("A", "B");

-- CreateIndex
CREATE INDEX "_channelblocked_B_index" ON "_channelblocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channelban_AB_unique" ON "_channelban"("A", "B");

-- CreateIndex
CREATE INDEX "_channelban_B_index" ON "_channelban"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_mpuser_AB_unique" ON "_mpuser"("A", "B");

-- CreateIndex
CREATE INDEX "_mpuser_B_index" ON "_mpuser"("B");

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_createurID_fkey" FOREIGN KEY ("createurID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_destByID_fkey" FOREIGN KEY ("destByID") REFERENCES "channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_mpID_fkey" FOREIGN KEY ("mpID") REFERENCES "mp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dem_friend" ADD CONSTRAINT "_dem_friend_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dem_friend" ADD CONSTRAINT "_dem_friend_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_acce_friend" ADD CONSTRAINT "_acce_friend_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_acce_friend" ADD CONSTRAINT "_acce_friend_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channeladmin" ADD CONSTRAINT "_channeladmin_A_fkey" FOREIGN KEY ("A") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channeladmin" ADD CONSTRAINT "_channeladmin_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channeluser" ADD CONSTRAINT "_channeluser_A_fkey" FOREIGN KEY ("A") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channeluser" ADD CONSTRAINT "_channeluser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelblocked" ADD CONSTRAINT "_channelblocked_A_fkey" FOREIGN KEY ("A") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelblocked" ADD CONSTRAINT "_channelblocked_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelban" ADD CONSTRAINT "_channelban_A_fkey" FOREIGN KEY ("A") REFERENCES "ban"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelban" ADD CONSTRAINT "_channelban_B_fkey" FOREIGN KEY ("B") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mpuser" ADD CONSTRAINT "_mpuser_A_fkey" FOREIGN KEY ("A") REFERENCES "mp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mpuser" ADD CONSTRAINT "_mpuser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
