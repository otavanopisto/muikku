package fi.otavanopisto.muikku.schooldata;

public class SchoolDataBridgeException extends RuntimeException {
	
	private static final long serialVersionUID = -3353362676991470842L;
	
	public SchoolDataBridgeException() {
	  super();
	}

	public SchoolDataBridgeException(Throwable rootCause) {
		super(rootCause);
	}

	public SchoolDataBridgeException(String message) {
		super(message);
	}

  public SchoolDataBridgeException(int statusCode, Throwable rootCause) {
    super(rootCause);
    this.statusCode = statusCode;
  }

  public SchoolDataBridgeException(int statusCode, String message) {
    super(message);
    this.statusCode = statusCode;
  }
  
  public SchoolDataBridgeException(int statusCode, String message, Throwable rootCause) {
    super(message, rootCause);
    this.statusCode = statusCode;
  }
  

  public int getStatusCode() {
    return statusCode;
  }

  public void setStatusCode(int statusCode) {
    this.statusCode = statusCode;
  }

  private int statusCode;

}
