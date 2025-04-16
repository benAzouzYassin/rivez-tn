alter table "public"."payments" drop column "currency_name";

alter table "public"."payments" add column "payment_link" text not null default ''::text;

alter table "public"."payments" add column "price_to_pay" numeric;


