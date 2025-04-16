set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_credits_to_user(user_id uuid, credits numeric)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN

  UPDATE user_profiles
  SET credit_balance = credit_balance + credits
  WHERE user_id = user_id;
  
END;$function$
;


