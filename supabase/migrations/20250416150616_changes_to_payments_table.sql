alter table "public"."payments" drop column "paid_amount";

alter table "public"."payments" add column "payment_ref" text;


