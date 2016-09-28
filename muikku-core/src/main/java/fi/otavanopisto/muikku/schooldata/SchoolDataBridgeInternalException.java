package fi.otavanopisto.muikku.schooldata;

public class SchoolDataBridgeInternalException extends SchoolDataBridgeException {

	private static final long serialVersionUID = 4038910859322277591L;

	public SchoolDataBridgeInternalException(Throwable rootCause) {
		super(500, rootCause);
	}
	
	public SchoolDataBridgeInternalException(String message) {
		super(500, message);
	}

	public SchoolDataBridgeInternalException(String message, Throwable rootCause) {
    super(500, message, rootCause);
  }

}
