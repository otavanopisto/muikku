package fi.otavanopisto.muikku.plugins.guider;

import java.util.Date;
import java.util.List;

class GuiderStudentActivity {

	public GuiderStudentActivity(String workspaceUrlName, List<Record> records) {
		this.workspaceUrlName = workspaceUrlName;
		this.records = records;
	}
	
	private String workspaceUrlName;
	private List<Record> records;
	
	public String getworkspaceUrlName() {
	  return this.workspaceUrlName;
	}
	
	public List<Record> getRecords() {
	  return this.records;
	}
}

class Record {
  
	public Record(String type, Date date) {
		this.type = type; 
		this.date = date;
	}
	
	private String type;
	private Date date;
	
	public String getType() {
	  return this.type;
	}
	
	public Date getDate() {
	  return this.date;
	}
}