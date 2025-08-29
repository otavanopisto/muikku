/**
 * TimerValue interface
 */
export interface TimerValue {
  timeRemainingMs: number; // Time remaining in milliseconds
  formattedTime: string; // Formatted time string (e.g., "10:00")
  isExpired: boolean;
  endTime: number;
}

/**
 * TimerCallbacks interface
 */
export interface TimerCallbacks {
  onExpire?: () => void;
  onWarning?: (timeRemainingMinutes: number) => void; // Optional: for warnings before expiry
}

/**
 * ExamTimerService
 */
export class ExamTimerService {
  private examId: number;
  private interval: NodeJS.Timeout | null = null;
  private subscribers: Set<(value: TimerValue) => void> = new Set();
  private currentValue: TimerValue;
  private startDate: string;
  private durationMinutes: number;
  private callbacks: TimerCallbacks;
  private warningThresholdMs: number = 300000; // 5 minutes warning
  private warningCallbackCalled: boolean = false; // Whether the warning callback has been called

  /**
   * ExamTimerService
   * @param examId examId
   * @param startDate startDate
   * @param durationMinutes durationMinutes
   * @param callbacks callbacks
   */
  constructor(
    examId: number,
    startDate: string,
    durationMinutes: number,
    callbacks?: TimerCallbacks
  ) {
    this.examId = examId;
    this.startDate = startDate;
    this.durationMinutes = durationMinutes;
    this.callbacks = callbacks || {};
    this.currentValue = this.calculateTimeRemaining();
    this.startTimer(startDate, durationMinutes);
  }

  /**
   * startTimer - Fixed to use parameters
   * @param startDate startDate
   * @param durationMinutes durationMinutes
   */
  private startTimer(startDate: string, durationMinutes: number) {
    // Clear existing interval
    if (this.interval) {
      clearInterval(this.interval);
    }

    // Update instance properties with new values
    this.startDate = startDate;
    this.durationMinutes = durationMinutes;

    // Recalculate current value with new parameters
    this.currentValue = this.calculateTimeRemaining();

    // Start new interval
    this.interval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  /**
   * stopTimer
   */
  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * subscribe
   * @param callback callback
   * @returns unsubscribe function
   */
  subscribe(callback: (value: TimerValue) => void) {
    this.subscribers.add(callback);
    // Return unsubscribe function
    return () => this.subscribers.delete(callback);
  }

  /**
   * notifySubscribers
   */
  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.currentValue));
  }

  /**
   * updateTimer
   */
  private updateTimer() {
    // Calculate new time
    const newValue = this.calculateTimeRemaining();

    // Check if timer just expired
    if (!this.currentValue.isExpired && newValue.isExpired) {
      this.callbacks.onExpire?.();
    }

    // Check if warning threshold reached
    if (
      !this.currentValue.isExpired &&
      !newValue.isExpired &&
      !this.warningCallbackCalled
    ) {
      if (
        newValue.timeRemainingMs <= this.warningThresholdMs &&
        newValue.timeRemainingMs > 0
      ) {
        this.callbacks.onWarning?.(this.warningThresholdMs / 1000 / 60);
        this.warningCallbackCalled = true;
      }
    }

    this.currentValue = newValue;

    // Notify all subscribers
    this.notifySubscribers();
  }

  /**
   * calculateTimeRemaining
   * @returns TimerValue
   */
  private calculateTimeRemaining(): TimerValue {
    const startDate = new Date(this.startDate);
    const durationMs = this.durationMinutes * 60 * 1000;
    const endTime = startDate.getTime() + durationMs;
    const now = Date.now();

    if (now >= endTime) {
      return {
        timeRemainingMs: 0,
        formattedTime: "Aika umpeutunut",
        isExpired: true,
        endTime,
      };
    }

    const remainingMs = endTime - now;
    const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
    const remainingSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    return {
      timeRemainingMs: remainingMs,
      formattedTime: `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`,
      isExpired: false,
      endTime,
    };
  }

  /**
   * updateCallbacks
   * @param callbacks callbacks
   */
  updateCallbacks(callbacks: TimerCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * getCurrentValue
   * @returns currentValue
   */
  getCurrentValue(): TimerValue {
    return this.currentValue;
  }

  /**
   * getExamId
   * @returns examId
   */
  getExamId(): number {
    return this.examId;
  }

  /**
   * isRunning
   * @returns boolean
   */
  isRunning(): boolean {
    return this.interval !== null;
  }
}

/**
 * ExamTimerRegistry
 */
export class ExamTimerRegistry {
  private static instance: ExamTimerRegistry;
  private timers: Map<number, ExamTimerService> = new Map();

  /**
   * getInstance
   * @returns instance
   */
  static getInstance(): ExamTimerRegistry {
    if (!ExamTimerRegistry.instance) {
      ExamTimerRegistry.instance = new ExamTimerRegistry();
    }
    return ExamTimerRegistry.instance;
  }

  /**
   * startTimer
   * @param examId examId
   * @param startDate startDate
   * @param durationMinutes durationMinutes
   * @param callbacks callbacks
   */
  startTimer(
    examId: number,
    startDate: string,
    durationMinutes: number,
    callbacks?: TimerCallbacks
  ) {
    if (this.timers.has(examId)) {
      this.timers.get(examId)?.stopTimer();
    }

    const timer = new ExamTimerService(
      examId,
      startDate,
      durationMinutes,
      callbacks
    );
    this.timers.set(examId, timer);
  }

  /**
   * updateTimerCallbacks
   * @param examId examId
   * @param callbacks callbacks
   */
  updateTimerCallbacks(examId: number, callbacks: TimerCallbacks) {
    const timer = this.timers.get(examId);
    if (timer) {
      timer.updateCallbacks(callbacks);
    }
  }

  /**
   * getTimer
   * @param examId examId
   * @returns timer
   */
  getTimer(examId: number): ExamTimerService | undefined {
    return this.timers.get(examId);
  }

  /**
   * getTimerValue
   * @param examId examId
   * @returns timerValue
   */
  getTimerValue(examId: number): TimerValue | null {
    const timer = this.timers.get(examId);
    return timer ? timer.getCurrentValue() : null;
  }

  /**
   * stopTimer
   * @param examId examId
   */
  stopTimer(examId: number) {
    const timer = this.timers.get(examId);
    if (timer) {
      timer.stopTimer();
      this.timers.delete(examId);
    }
  }

  /**
   * stopAllTimers
   */
  stopAllTimers() {
    this.timers.forEach((timer) => timer.stopTimer());
    this.timers.clear();
  }

  /**
   * hasTimer
   * @param examId examId
   * @returns boolean
   */
  hasTimer(examId: number): boolean {
    return this.timers.has(examId);
  }

  /**
   * getActiveTimerCount
   * @returns number
   */
  getActiveTimerCount(): number {
    return this.timers.size;
  }
}
