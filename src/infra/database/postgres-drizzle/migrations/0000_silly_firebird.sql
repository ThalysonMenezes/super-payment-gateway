CREATE TYPE "public"."transaction_status" AS ENUM('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"status" "transaction_status" DEFAULT 'PENDING' NOT NULL,
	"idempotency_key" text NOT NULL,
	"provider_response" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "transactions_merchant_id_idempotency_key_idx" ON "transactions" USING btree ("merchant_id","idempotency_key");