package fi.muikku.plugins.progressanalysis;

import java.util.Date;

public class StudyActivityWorkspaceAnalysis {

  public StudyActivityWorkspaceAnalysis(long evaluableUnanswered, Date lastEvaluableAssignmentAnswerDate, long evaluableAssignmentAnswered,
      long evaluableSubmitted, Date lastEvaluableSubmitDate, long evaluableEvaluated, Date lastEvaluableEvaluationDate, long exercisesUnaswered,
      long exercisesAswered, Date lastExerciseSubmittedDate) {
    super();
    this.evaluableUnanswered = evaluableUnanswered;
    this.lastEvaluableAssignmentAnswerDate = lastEvaluableAssignmentAnswerDate;
    this.evaluableAssignmentAnswered = evaluableAssignmentAnswered;
    this.evaluableSubmitted = evaluableSubmitted;
    this.lastEvaluableSubmitDate = lastEvaluableSubmitDate;
    this.evaluableEvaluated = evaluableEvaluated;
    this.lastEvaluableEvaluationDate = lastEvaluableEvaluationDate;
    this.exercisesUnaswered = exercisesUnaswered;
    this.exercisesAswered = exercisesAswered;
    this.lastExerciseSubmittedDate = lastExerciseSubmittedDate;
        
    this.exercises = exercisesUnaswered + exercisesAswered;
    this.evaluables = evaluableUnanswered + evaluableAssignmentAnswered + evaluableSubmitted + evaluableEvaluated;
    double done =  (exercises + evaluables);
    this.donePercent = ((exercisesAswered + evaluableSubmitted + evaluableEvaluated) / done) * 100;
  }

  public double getDonePercent() {
    return donePercent;
  }
  
  public long getEvaluableUnanswered() {
    return evaluableUnanswered;
  }

  public Date getLastEvaluableAssignmentAnswerDate() {
    return lastEvaluableAssignmentAnswerDate;
  }

  public long getEvaluableAssignmentAnswered() {
    return evaluableAssignmentAnswered;
  }

  public long getEvaluableSubmitted() {
    return evaluableSubmitted;
  }

  public Date getLastEvaluableSubmitDate() {
    return lastEvaluableSubmitDate;
  }

  public long getEvaluableEvaluated() {
    return evaluableEvaluated;
  }

  public Date getLastEvaluableEvaluationDate() {
    return lastEvaluableEvaluationDate;
  }

  public long getExercisesUnaswered() {
    return exercisesUnaswered;
  }

  public long getExercisesAswered() {
    return exercisesAswered;
  }

  public Date getLastExerciseSubmittedDate() {
    return lastExerciseSubmittedDate;
  }

  public long getExercises() {
    return exercises;
  }

  public long getEvaluables() {
    return evaluables;
  }

  private long evaluableUnanswered;
  private Date lastEvaluableAssignmentAnswerDate;
  private long evaluableAssignmentAnswered;
  private long evaluableSubmitted;
  private Date lastEvaluableSubmitDate;
  private long evaluableEvaluated;
  private Date lastEvaluableEvaluationDate;
  private long exercisesUnaswered;
  private long exercisesAswered;
  private Date lastExerciseSubmittedDate;
  private long exercises;
  private long evaluables;
  private double donePercent;
}
