-- CreateTable
CREATE TABLE "events" (
    "event_id" SERIAL NOT NULL,
    "event_name" VARCHAR(100) NOT NULL,
    "event_start_date" VARCHAR(50) NOT NULL DEFAULT '',
    "event_end_date" VARCHAR(50) NOT NULL DEFAULT '',
    "event_location" VARCHAR(100) NOT NULL DEFAULT '',
    "event_timezone" VARCHAR(50) NOT NULL DEFAULT '',
    "event_address1" VARCHAR(200) NOT NULL DEFAULT '',
    "event_address2" VARCHAR(200) NOT NULL DEFAULT '',
    "event_country" VARCHAR(50) NOT NULL DEFAULT '',
    "event_state" VARCHAR(50) NOT NULL DEFAULT '',
    "event_zip" VARCHAR(50) NOT NULL DEFAULT '',
    "event_description" VARCHAR(1000) NOT NULL DEFAULT '',
    "event_banner" JSONB NOT NULL,
    "event_thumbnail" JSONB NOT NULL,
    "event_status" TEXT NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "attendees" (
    "attendee_id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL DEFAULT '',
    "email" VARCHAR(100) NOT NULL DEFAULT '',
    "company_name" VARCHAR(100) NOT NULL DEFAULT '',
    "title" VARCHAR(100) NOT NULL DEFAULT '',
    "address1" VARCHAR(200) NOT NULL DEFAULT '',
    "address2" VARCHAR(200) NOT NULL DEFAULT '',
    "country" VARCHAR(50) NOT NULL DEFAULT '',
    "state" VARCHAR(50) NOT NULL DEFAULT '',
    "zip" VARCHAR(50) NOT NULL DEFAULT '',
    "phone" VARCHAR(20) NOT NULL DEFAULT '',
    "profile_photo" JSONB NOT NULL,
    "banner" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("attendee_id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "sponsor_id" SERIAL NOT NULL,
    "contact_title" VARCHAR(100) NOT NULL,
    "company_name" VARCHAR(100) NOT NULL DEFAULT '',
    "contact_first_name" VARCHAR(100) NOT NULL DEFAULT '',
    "contact_last_name" VARCHAR(100) NOT NULL DEFAULT '',
    "contact_email" VARCHAR(100) NOT NULL DEFAULT '',
    "contact_phone" VARCHAR(20) NOT NULL DEFAULT '',
    "address1" VARCHAR(200) NOT NULL DEFAULT '',
    "address2" VARCHAR(200) NOT NULL DEFAULT '',
    "country" VARCHAR(50) NOT NULL DEFAULT '',
    "state" VARCHAR(50) NOT NULL DEFAULT '',
    "zip" VARCHAR(50) NOT NULL DEFAULT '',
    "logo" JSONB NOT NULL,
    "banner" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("sponsor_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(50) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "venues" (
    "venue_id" SERIAL NOT NULL,
    "venue_name" VARCHAR(100) NOT NULL,
    "company_name" VARCHAR(100) NOT NULL DEFAULT '',
    "contact_first_name" VARCHAR(100) NOT NULL DEFAULT '',
    "contact_last_name" VARCHAR(100) NOT NULL DEFAULT '',
    "contact_email" VARCHAR(100) NOT NULL DEFAULT '',
    "contact_phone" VARCHAR(20) NOT NULL DEFAULT '',
    "address1" VARCHAR(200) NOT NULL DEFAULT '',
    "address2" VARCHAR(200) NOT NULL DEFAULT '',
    "country" VARCHAR(50) NOT NULL DEFAULT '',
    "state" VARCHAR(50) NOT NULL DEFAULT '',
    "zip" VARCHAR(50) NOT NULL DEFAULT '',
    "logo" JSONB NOT NULL,
    "banner" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("venue_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
