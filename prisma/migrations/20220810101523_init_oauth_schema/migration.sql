-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "insert_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(250),
    "insert_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" VARCHAR(24) NOT NULL,
    "name" VARCHAR(255),
    "location" VARCHAR(255),
    "group_id" VARCHAR(24),
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "insert_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3),

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "client_username_key" ON "client"("username");
