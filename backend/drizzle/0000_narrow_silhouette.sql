CREATE TABLE "exercices" (
	"exercice_id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" text,
	"type" varchar,
	"total_duration" numeric,
	"inhalation_duration" integer,
	"hold_duration" integer DEFAULT 0,
	"exhalation_duration" integer,
	"cycle_" integer,
	"status" boolean
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"last_name" varchar,
	"first_name" varchar,
	"gender" varchar,
	"birth_day" date,
	"login" varchar,
	"password" text,
	"street_number" varchar,
	"street_name" varchar,
	"city" varchar,
	"postal_code" integer,
	"country" varchar,
	"address_complement" varchar,
	"role" varchar,
	"registration_date" date
);
--> statement-breakpoint
CREATE TABLE "user_exercice" (
	"user_id" integer NOT NULL,
	"exercice_id" integer NOT NULL,
	"feeling" varchar(50) NOT NULL,
	"date_completion" date NOT NULL,
	CONSTRAINT "user_exercice_user_id_exercice_id_pk" PRIMARY KEY("user_id","exercice_id")
);
--> statement-breakpoint
ALTER TABLE "user_exercice" ADD CONSTRAINT "user_exercice_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_exercice" ADD CONSTRAINT "user_exercice_exercice_id_exercices_exercice_id_fk" FOREIGN KEY ("exercice_id") REFERENCES "public"."exercices"("exercice_id") ON DELETE no action ON UPDATE no action;