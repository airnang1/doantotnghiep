-- AlterTable
ALTER TABLE "user" ADD COLUMN     "name" VARCHAR(255),
ADD COLUMN     "role_id" UUID,
ADD COLUMN     "status" INTEGER DEFAULT 1;

-- CreateTable
CREATE TABLE "permission" (
    "can_view" BOOLEAN,
    "can_create" BOOLEAN,
    "can_edit" BOOLEAN,
    "can_delete" BOOLEAN,
    "role_id" UUID NOT NULL,
    "feature_id" UUID NOT NULL,
    "insert_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3),

    CONSTRAINT "permission_pkey" PRIMARY KEY ("role_id","feature_id")
);

-- CreateTable
CREATE TABLE "feature" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "insert_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3),

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feature_code_key" ON "feature"("code");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
