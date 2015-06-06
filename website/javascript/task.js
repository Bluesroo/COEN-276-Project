/**
 * This is the task object
 *
 * @param taskName
 * @param tag
 * @param dueDate
 * @param alarm: If there is no alarm it is false
 *               If there is an alarm it is the alarm time
 * @constructor
 */
function Task(taskName, tag, dueDate, alarm) {
    this.taskName = taskName;
    this.tag = tag;
    this.id = -1;

    // alarmTime is local to the client
    this.alarmTime = alarm;
    this.alarmDone = false;

    this.dueDate = dueDate;
    if (this.dueDate == null) {
        this.dueDate = 9000000000;
    }

    this.priority = setPriority(this);
}

/**
 * Enum for the task priorities
 */
var PriorityEnum = {
    UNIMPORTANT: 0,
    IMPORTANT: 1,
    CRITICAL: 2,
    LATE: 3
};
Object.freeze(PriorityEnum);

/**
 * Sets the priority of a task based on its due date
 *
 * @param task
 * @returns {number}: The priority number
 */
function setPriority(task) {
    if (task.dueDate == null) {
        return PriorityEnum.UNIMPORTANT;
    }

    var timeZoneOffset = Math.round(new Date().getTimezoneOffset() * 60);
    var nowUtc = Math.round(new Date().getTime() / 1000.0);
    var nowLocal = nowUtc - timeZoneOffset;

    if (task.dueDate - nowLocal < 0) {
        return PriorityEnum.LATE;
    }
    else if (task.dueDate - nowLocal < 600) {
        return PriorityEnum.CRITICAL;
    }
    else if (task.dueDate - nowLocal < 3600) {
        return PriorityEnum.IMPORTANT;
    }
    return PriorityEnum.UNIMPORTANT;
}