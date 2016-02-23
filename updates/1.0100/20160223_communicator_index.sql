DROP INDEX IF EXISTS sender_id_idx ON communicatormessage;
CREATE INDEX sender_id_idx ON communicatormessage (sender_id);
