-- Backfill legacy phone formats to canonical +880… before new inserts use that form.
update registrations
set phone = case
  when phone like '+880%' then phone
  when phone like '880%' then '+' || phone
  when phone like '0%' then '+880' || substring(phone from 2)
  else phone
end
where phone not like '+880%';
