-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "phone" VARCHAR,
    "email" VARCHAR,
    "street" VARCHAR,
    "suburb" VARCHAR,
    "zip_code" VARCHAR,
    "state" VARCHAR,
    "council_name" VARCHAR,
    "council_region" VARCHAR,
    "council_website" VARCHAR,
    "seo_title" VARCHAR,
    "seo_description" TEXT,
    "site_description" TEXT,
    "entry_fees" JSON,
    "operating_hours" JSON,
    "social_links" JSON,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "location_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "page_title" VARCHAR,
    "phone" VARCHAR,
    "email" VARCHAR,
    "seo_title" VARCHAR,
    "seo_description" TEXT,
    "page_content" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "service_location_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "service_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_by_location" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "location_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "service_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "services_by_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL,
    "first_name" VARCHAR,
    "role_id" UUID NOT NULL DEFAULT 'e4471f4f-32e9-4849-9e2a-8e874f15a49a'::uuid,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_by_location_unique" ON "services_by_location"("location_id", "service_id");

-- AddForeignKey
ALTER TABLE "role_locations" ADD CONSTRAINT "role_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_locations" ADD CONSTRAINT "role_locations_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_details" ADD CONSTRAINT "service_details_service_location_id_fkey" FOREIGN KEY ("service_location_id") REFERENCES "services_by_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_by_location" ADD CONSTRAINT "services_by_location_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_by_location" ADD CONSTRAINT "services_by_location_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

