-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VISITOR', 'MODEL', 'MODERATOR', 'ADMIN');
CREATE TYPE "ModelStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED');
CREATE TYPE "PlanType" AS ENUM ('FREE', 'SILVER', 'GOLD', 'ELITE');
CREATE TYPE "ServiceType" AS ENUM ('LOCAL', 'OUTCALL', 'BOTH', 'TRAVEL');
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO', 'STORY', 'COMPARISON');
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REJECTED');
CREATE TYPE "ModerationAction" AS ENUM ('APPROVE', 'REJECT', 'SUSPEND', 'BAN');
CREATE TYPE "ModerationTarget" AS ENUM ('MODEL', 'MEDIA', 'REVIEW');
CREATE TYPE "CoinTransactionType" AS ENUM ('PURCHASE', 'SPEND', 'GIFT_RECEIVED', 'WITHDRAWAL');
CREATE TYPE "CoinTransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');
CREATE TYPE "ServiceMode" AS ENUM ('DO', 'RECEIVE', 'BOTH');

-- CreateTable users
CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "role" "UserRole" NOT NULL DEFAULT 'VISITOR',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable models
CREATE TABLE "models" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "stage_name" TEXT NOT NULL,
  "real_name" TEXT,
  "gender" TEXT,
  "genital" TEXT,
  "sexual_pref" TEXT,
  "age" INTEGER,
  "weight" DOUBLE PRECISION,
  "height" DOUBLE PRECISION,
  "ethnicity" TEXT,
  "eye_color" TEXT,
  "hair_style" TEXT,
  "hair_size" TEXT,
  "has_silicone" BOOLEAN,
  "has_tattoo" BOOLEAN,
  "smokes" BOOLEAN,
  "languages" JSONB NOT NULL DEFAULT '[]',
  "bio" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "neighborhood" TEXT,
  "service_type" "ServiceType" NOT NULL DEFAULT 'LOCAL',
  "whatsapp" TEXT,
  "email" TEXT,
  "price_min" DOUBLE PRECISION,
  "price_table" JSONB,
  "status" "ModelStatus" NOT NULL DEFAULT 'PENDING',
  "plan" "PlanType" NOT NULL DEFAULT 'FREE',
  "plan_expires_at" TIMESTAMP(3),
  "verified_at" TIMESTAMP(3),
  "verified_by" TEXT,
  "view_count" INTEGER NOT NULL DEFAULT 0,
  "favorite_count" INTEGER NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "is_online" BOOLEAN NOT NULL DEFAULT false,
  "last_seen_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable medias
CREATE TABLE "medias" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "model_id" TEXT NOT NULL,
  "type" "MediaType" NOT NULL,
  "url" TEXT NOT NULL,
  "thumbnail_url" TEXT,
  "is_face" BOOLEAN NOT NULL DEFAULT false,
  "is_premium" BOOLEAN NOT NULL DEFAULT false,
  "is_main" BOOLEAN NOT NULL DEFAULT false,
  "order_index" INTEGER NOT NULL DEFAULT 0,
  "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
  "reject_reason" TEXT,
  "expires_at" TIMESTAMP(3),
  "size_bytes" INTEGER,
  "duration_secs" DOUBLE PRECISION,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE
);

-- CreateTable services
CREATE TABLE "services" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "icon" TEXT
);

-- CreateTable model_services
CREATE TABLE "model_services" (
  "model_id" TEXT NOT NULL,
  "service_id" TEXT NOT NULL,
  "mode" "ServiceMode" NOT NULL DEFAULT 'BOTH',
  "is_specialty" BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY ("model_id", "service_id"),
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE CASCADE
);

-- CreateTable availability
CREATE TABLE "availability" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "model_id" TEXT NOT NULL,
  "weekday" INTEGER NOT NULL,
  "start_time" TEXT NOT NULL,
  "end_time" TEXT NOT NULL,
  "is_available" BOOLEAN NOT NULL DEFAULT true,
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE
);

-- CreateTable reviews
CREATE TABLE "reviews" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "model_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "helpful_count" INTEGER NOT NULL DEFAULT 0,
  "unhelpful_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable questions
CREATE TABLE "questions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "model_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT,
  "helpful_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable favorites
CREATE TABLE "favorites" (
  "user_id" TEXT NOT NULL,
  "model_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "model_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE
);

-- CreateTable weekly_votes
CREATE TABLE "weekly_votes" (
  "user_id" TEXT NOT NULL,
  "model_id" TEXT NOT NULL,
  "week_number" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "model_id", "week_number", "year"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE
);

-- CreateTable coin_packages
CREATE TABLE "coin_packages" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "coins" INTEGER NOT NULL,
  "price_brl" DOUBLE PRECISION NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable coin_transactions
CREATE TABLE "coin_transactions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "type" "CoinTransactionType" NOT NULL,
  "coins" INTEGER NOT NULL,
  "amount_brl" DOUBLE PRECISION,
  "description" TEXT,
  "reference_id" TEXT,
  "status" "CoinTransactionStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable coin_balances
CREATE TABLE "coin_balances" (
  "user_id" TEXT NOT NULL PRIMARY KEY,
  "balance" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable plans
CREATE TABLE "plans" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "price_monthly" DOUBLE PRECISION NOT NULL,
  "features" JSONB NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable subscriptions
CREATE TABLE "subscriptions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "model_id" TEXT NOT NULL,
  "plan_id" TEXT NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "starts_at" TIMESTAMP(3) NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "payment_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("plan_id") REFERENCES "plans" ("id")
);

-- CreateTable payments
CREATE TABLE "payments" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "amount_brl" DOUBLE PRECISION NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "gateway" TEXT NOT NULL DEFAULT 'MERCADO_PAGO',
  "gateway_id" TEXT,
  "gateway_data" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable withdrawals
CREATE TABLE "withdrawals" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "model_id" TEXT NOT NULL,
  "amount_brl" DOUBLE PRECISION NOT NULL,
  "coins" INTEGER NOT NULL,
  "pix_key" TEXT NOT NULL,
  "pix_key_type" TEXT NOT NULL,
  "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
  "approved_by" TEXT,
  "paid_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE
);

-- CreateTable moderation_logs
CREATE TABLE "moderation_logs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "moderator_id" TEXT NOT NULL,
  "target_type" "ModerationTarget" NOT NULL,
  "target_id" TEXT NOT NULL,
  "action" "ModerationAction" NOT NULL,
  "reason" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("moderator_id") REFERENCES "users" ("id")
);

-- CreateTable audit_logs
CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT NOT NULL,
  "metadata" JSONB,
  "ip" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

-- CreateIndex
CREATE INDEX "models_user_id_idx" ON "models" ("user_id");
CREATE INDEX "models_slug_idx" ON "models" ("slug");
CREATE INDEX "medias_model_id_idx" ON "medias" ("model_id");
CREATE INDEX "reviews_model_id_idx" ON "reviews" ("model_id");
CREATE INDEX "reviews_user_id_idx" ON "reviews" ("user_id");
CREATE INDEX "questions_model_id_idx" ON "questions" ("model_id");
CREATE INDEX "questions_user_id_idx" ON "questions" ("user_id");
CREATE INDEX "coin_transactions_user_id_idx" ON "coin_transactions" ("user_id");
CREATE INDEX "subscriptions_model_id_idx" ON "subscriptions" ("model_id");
CREATE INDEX "subscriptions_plan_id_idx" ON "subscriptions" ("plan_id");
CREATE INDEX "payments_user_id_idx" ON "payments" ("user_id");
CREATE INDEX "withdrawals_model_id_idx" ON "withdrawals" ("model_id");
