package fi.otavanopisto.muikku.plugins.fish;

public class FishMessages {
    public FishMessages(FishMessage[] messages) {
      this.messages = messages;
    }
    
    public FishMessage[] getMessages() {
      return messages;
    }
    
    public long getCount() {
      return messages.length;
    }
    
    private FishMessage[] messages;
}
