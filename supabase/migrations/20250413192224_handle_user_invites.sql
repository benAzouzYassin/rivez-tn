alter table "public"."user_profiles" add column "inviter" uuid;

alter table "public"."user_profiles" add constraint "user_profiles_inviter_fkey" FOREIGN KEY (inviter) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_inviter_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_user_invite(inviter_id uuid, invited_user_id uuid, credit_for_inviter numeric, credit_for_invited numeric)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN

  UPDATE user_profiles
  SET inviter = inviter_id
  WHERE user_id = invited_user_id;
  
  UPDATE user_profiles
  SET credit_balance = credit_balance + credit_for_invited
  WHERE user_id = invited_user_id;
  
  UPDATE user_profiles
  SET credit_balance = credit_balance + credit_for_inviter
  WHERE user_id = inviter_id;
END;
$function$
;


