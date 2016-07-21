package fi.otavanopisto.muikku.utils;

import java.io.IOException;
import java.util.Date;

import org.threeten.bp.DateTimeUtils;
import org.threeten.bp.ZoneId;
import org.threeten.bp.ZonedDateTime;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class MuikkuDateTimeStampDeserializer extends StdDeserializer<ZonedDateTime> {

  private static final long serialVersionUID = -4746289317645203051L;

  public MuikkuDateTimeStampDeserializer(Class<ZonedDateTime> t) {
    super(t);
  }

  @Override
  public ZonedDateTime deserialize(JsonParser jsonParser, DeserializationContext context)
      throws IOException, JsonProcessingException {
    Long dateTimeMillis = jsonParser.nextLongValue(0);
    return DateTimeUtils.toInstant(new Date(dateTimeMillis)).atZone(ZoneId.systemDefault());
  }

}
