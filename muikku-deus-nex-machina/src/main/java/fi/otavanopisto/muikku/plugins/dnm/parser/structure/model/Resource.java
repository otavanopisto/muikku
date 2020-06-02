package fi.otavanopisto.muikku.plugins.dnm.parser.structure.model;

public abstract class Resource {

	public Integer getNo() {
		return no;
	}
	
	public void setNo(Integer no) {
		this.no = no;
	}

	public Type getType() {
		return type;
	}
	
	public void setType(Type type) {
		this.type = type;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getPath() {
		return path;
	}
	
	public void setPath(String path) {
		this.path = path;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public Boolean getHidden() {
    return hidden;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }

  private Integer no;
	private Type type;
	private String path;
	private String title;
	private String name;
	private Boolean hidden;
}
