package fi.otavanopisto.muikku.utils;

import java.io.IOException;

import org.threeten.bp.ZonedDateTime;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class MuikkuDateSerializer extends StdSerializer<ZonedDateTime> {

  private static final long serialVersionUID = -2454365657467413722L;
  
  public MuikkuDateSerializer(Class<ZonedDateTime> t) {
    super(t);
  }

  @Override
  public void serialize(ZonedDateTime zonedDateTime, JsonGenerator jsonGenerator, SerializerProvider sp) throws IOException {
    jsonGenerator.writeString(zonedDateTime.toString());
  }

}
