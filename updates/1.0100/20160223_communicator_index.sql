-- http://dba.stackexchange.com/a/62997
select if (
    exists(
        select distinct index_name from information_schema.statistics 
        where table_schema = 'muikku'
        and table_name = 'communicatormessage' and index_name like 'sender_id_idx'
    )
    ,'select ''index sender_id_idx exists'' _______;'
    ,'create index sender_id_idx on communicatormessage(sender_id)') into @a;
PREPARE stmt1 FROM @a;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;
