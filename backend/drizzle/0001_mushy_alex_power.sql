CREATE TYPE "public"."feeling_enum" AS ENUM('good', 'neutral', 'bad', 'anxious', 'relaxed');--> statement-breakpoint
ALTER TABLE "user_exercice" DROP CONSTRAINT "user_exercice_user_id_exercice_id_pk";--> statement-breakpoint
ALTER TABLE "exercices" ALTER COLUMN "total_duration" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "login" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_exercice" ALTER COLUMN "user_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "user_exercice" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_exercice" ALTER COLUMN "feeling" SET DATA TYPE "public"."feeling_enum" USING "feeling"::"public"."feeling_enum";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user_exercice" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "user_exercice" ADD COLUMN "guest_id" varchar(255) DEFAULT null;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_login_unique" UNIQUE("login");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");