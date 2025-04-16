CREATE INDEX payments_order_id_idx ON public.payments USING btree (order_id);

CREATE INDEX payments_user_id_idx ON public.payments USING btree (user_id);


