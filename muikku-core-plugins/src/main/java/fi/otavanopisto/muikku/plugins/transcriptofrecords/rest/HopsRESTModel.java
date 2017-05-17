package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

public class HopsRESTModel {

  public HopsRESTModel() {
  }

  public HopsRESTModel(String goalSecondarySchoolDegree, String goalMatriculationExam, String vocationalYears,
      String goalJustMatriculationExam, String justTransferCredits, String transferCreditYears, String completionYears,
      String mathSyllabus, String finnish, boolean swedish, boolean english, boolean german, boolean french,
      boolean italian, boolean spanish, String science, String religion, String additionalInfo) {
    this.goalSecondarySchoolDegree = goalSecondarySchoolDegree;
    this.goalMatriculationExam = goalMatriculationExam;
    this.vocationalYears = vocationalYears;
    this.goalJustMatriculationExam = goalJustMatriculationExam;
    this.justTransferCredits = justTransferCredits;
    this.transferCreditYears = transferCreditYears;
    this.completionYears = completionYears;
    this.mathSyllabus = mathSyllabus;
    this.finnish = finnish;
    this.swedish = swedish;
    this.english = english;
    this.german = german;
    this.french = french;
    this.italian = italian;
    this.spanish = spanish;
    this.science = science;
    this.religion = religion;
    this.additionalInfo = additionalInfo;
  }

  public String getGoalSecondarySchoolDegree() {
    return goalSecondarySchoolDegree;
  }

  public void setGoalSecondarySchoolDegree(String goalSecondarySchoolDegree) {
    this.goalSecondarySchoolDegree = goalSecondarySchoolDegree;
  }

  public String getGoalMatriculationExam() {
    return goalMatriculationExam;
  }

  public void setGoalMatriculationExam(String goalMatriculationExam) {
    this.goalMatriculationExam = goalMatriculationExam;
  }

  public String getVocationalYears() {
    return vocationalYears;
  }

  public void setVocationalYears(String vocationalYears) {
    this.vocationalYears = vocationalYears;
  }

  public String getGoalJustMatriculationExam() {
    return goalJustMatriculationExam;
  }

  public void setGoalJustMatriculationExam(String goalJustMatriculationExam) {
    this.goalJustMatriculationExam = goalJustMatriculationExam;
  }

  public String getJustTransferCredits() {
    return justTransferCredits;
  }

  public void setJustTransferCredits(String justTransferCredits) {
    this.justTransferCredits = justTransferCredits;
  }

  public String getTransferCreditYears() {
    return transferCreditYears;
  }

  public void setTransferCreditYears(String transferCreditYears) {
    this.transferCreditYears = transferCreditYears;
  }

  public String getCompletionYears() {
    return completionYears;
  }

  public void setCompletionYears(String completionYears) {
    this.completionYears = completionYears;
  }

  public String getMathSyllabus() {
    return mathSyllabus;
  }

  public void setMathSyllabus(String mathSyllabus) {
    this.mathSyllabus = mathSyllabus;
  }

  public String getFinnish() {
    return finnish;
  }

  public void setFinnish(String finnish) {
    this.finnish = finnish;
  }

  public boolean isSwedish() {
    return swedish;
  }

  public void setSwedish(boolean swedish) {
    this.swedish = swedish;
  }

  public boolean isEnglish() {
    return english;
  }

  public void setEnglish(boolean english) {
    this.english = english;
  }

  public boolean isGerman() {
    return german;
  }

  public void setGerman(boolean german) {
    this.german = german;
  }

  public boolean isFrench() {
    return french;
  }

  public void setFrench(boolean french) {
    this.french = french;
  }

  public boolean isItalian() {
    return italian;
  }

  public void setItalian(boolean italian) {
    this.italian = italian;
  }

  public boolean isSpanish() {
    return spanish;
  }

  public void setSpanish(boolean spanish) {
    this.spanish = spanish;
  }

  public String getScience() {
    return science;
  }

  public void setScience(String science) {
    this.science = science;
  }

  public String getReligion() {
    return religion;
  }

  public void setReligion(String religion) {
    this.religion = religion;
  }

  public String getAdditionalInfo() {
    return additionalInfo;
  }

  public void setAdditionalInfo(String additionalInfo) {
    this.additionalInfo = additionalInfo;
  }

  private String goalSecondarySchoolDegree;
  private String goalMatriculationExam;
  private String vocationalYears;
  private String goalJustMatriculationExam;
  private String justTransferCredits;
  private String transferCreditYears;
  private String completionYears;
  private String mathSyllabus;
  private String finnish;
  private boolean swedish;
  private boolean english;
  private boolean german;
  private boolean french;
  private boolean italian;
  private boolean spanish;
  private String science;
  private String religion;
  private String additionalInfo;
}
