/**
 * This object stores the master lists of tasks and tags
 */
function TasksLists() {
    this.idCount = 0;
    this.taskCount = 0;

    this.allTasks = [];
    this.doneTasks = [];
    this.allTags = [
        new Tag("None", "white"),
        new Tag("School", "red"),
        new Tag("Work", "green"),
        new Tag("Life", "blue"),
        new Tag("Fun", "brown")
    ];

    this.currentList = this.allTasks;
    this.listState = "None";
    this.editing = false;

    /**
     * Adds a task to the main task list after checking inputs
     * Also checks whether or not the task is being added or edited
     *
     * @param task
     */
    this.addTask = function (task) {
        if (task.id < 0) {
            task.id = this.idCount++;
        }
        var taskIndex = this.getTaskIndex(task.id);
        if (this.editing) {
            this.allTasks[taskIndex] = task;
        }

        var tagIndex = this.hasTag(task.tag);
        if (tagIndex > -1) {
            task.tag = this.allTags[tagIndex];
        }
        else {
            task.tag = this.allTags[0];
        }

        if (!this.editing) {
            this.allTasks.push(task);
            this.taskCount++;
        }

        this.editing = false;
        this.sortAll();
        this.switchList(this.listState);
    };

    /**
     * Returns the task given an id
     *
     * @param taskId
     * @returns {*}: If taskId exists in the list, returns the task
     *               If taskId doesn't exist in the list, returns false
     */
    this.getTask = function (taskId) {
        for (var i = 0; i < this.allTasks.length; i++) {
            if (this.allTasks[i].id == taskId) {
                return this.allTasks[i];
            }
        }
        return false;
    };

    /**
     * Returns the task index in allTasks given an id
     *
     * @param taskId
     * @returns {*}: If taskId exists in the list, returns the task index
     *               If taskId doesn't exist in the list, returns false
     */
    this.getTaskIndex = function (taskId) {
        for (var i = 0; i < this.allTasks.length; i++) {
            if (this.allTasks[i].id == taskId) {
                return i;
            }
        }
        return false;
    };

    /**
     * Moves a task to the done list based on its id
     *
     * @param taskId
     */
    this.finishTask = function (taskId) {
        for (var i = 0; i < this.taskCount; i++) {
            if (this.allTasks[i].id == taskId) {
                var doneTask = this.allTasks.splice(i, 1);
                this.doneTasks.push(doneTask[0]);
                break;
            }
        }

        this.taskCount--;
        this.switchList(this.listState);
    };

    /**
     * Checks if a tag exists
     *
     * @param type
     * @returns {number}: 0+ the index of the tag if it is there
     *                    -2 there was no match
     */
    this.hasTag = function (type) {
        for (var tagIndex = 0; tagIndex < this.allTags.length; tagIndex++) {
            if (this.allTags[tagIndex].match(type)) {
                return tagIndex;
            }
        }
        return -2;
    };

    /**
     * Switches the list to another tag or to the default view
     *
     * @param state: a string, the desired state of the currentList
     */
    this.switchList = function (state) {
        if (state == "None") {
            this.currentList = this.allTasks;
        }
        else {
            var tagIndex;
            if ((tagIndex = this.hasTag(state)) >= 0) {
                this.createList(this.allTags[tagIndex]);
            }
        }

        this.listState = state;
    };

    /**
     * For internal use, is called from switchList
     *
     * @param tag: the tag that the currentList is switching to
     */
    this.createList = function (tag) {
        var newList = [];

        for (var i = 0; i < this.taskCount; i++) {
            if (this.allTasks[i].tag.match(tag)) {
                newList.push(this.allTasks[i]);
            }
        }

        this.currentList = [];
        this.currentList = newList;
    };

    /**
     * Sorts the main list based on the due dates
     */
    this.sortAll = function () {
        if (this.allTasks.length < 2) {
            return;
        }

        for (var i = this.allTasks.length - 1; i >= 0; i--) {
            for (var j = i - 1; j >= 0; j--) {
                if (this.allTasks[i].dueDate < this.allTasks[j].dueDate) {
                    var temp = this.allTasks[i];
                    this.allTasks[i] = this.allTasks[j];
                    this.allTasks[j] = temp;
                }
            }
        }
    };

    /**
     * Refreshes the tasks in the main list and checks for/ raises any alarms
     */
    this.refresh = function () {
        for (var i = 0; i < this.allTasks.length; i++) {
            var task = this.allTasks[i];
            setPriority(task);
            this.sortAll();

            // Checking for alarms
            if (!task.alarmDone && task.alarmTime) {
                // Getting the local time
                var timeZoneOffset = Math.round(new Date().getTimezoneOffset() * 60);
                var nowUtc = Math.round(new Date().getTime() / 1000.0);
                var nowLocal = nowUtc - timeZoneOffset;

                if (task.dueDate - task.alarmTime < nowLocal) {
                    alert("Alarm for: " + task.taskName);
                    this.allTasks[i].alarmDone = true;
                }
            }
        }
    };

    /**
     * Generates the tag options
     *
     * @returns {string}: The html for the tag options
     */
    this.generateTagOptions = function () {
        var optionsHtml = "";

        for (var i = 0; i < this.allTags.length; i++) {
            optionsHtml = optionsHtml.concat("<option value='" + this.allTags[i].tagName + "'>" + this.allTags[i].tagName + "</option>");
        }
        return optionsHtml;
    };

    /**
     * Generates the to do list based on the current list
     *
     * @returns {string}: The html for the list
     */
    this.generateList = function () {
        var htmlString = "";

        htmlString = htmlString.concat("<tr></tr><tr><th>Name</th><th>Tag</th><th>Checkbox</th></tr>");
        for (var i = 0; i < this.currentList.length; i++) {
            var task = this.currentList[i];
            htmlString = htmlString.concat("<tr id='" + task.id + "'><td>" + task.taskName + "</td><td>" + task.tag.tagName +
                "</td><td><input type='radio' name='alarm' class='alarmButton' value='testing'/></td></tr>");
        }
        return htmlString;
    };

    /**
     * Generates the finished list
     *
     * @returns {string}: The html for the list
     */
    this.generateFinishedList = function () {
        var htmlString = "";

        htmlString = htmlString.concat("<tr></tr><tr><th>Name</th><th>Tag</th></tr>");
        for (var i = this.doneTasks.length - 1; i > -1; i--) {
            var task = this.doneTasks[i];
            htmlString = htmlString.concat("<tr id='" + task.id + "'><td>" + task.taskName + "</td><td>" + task.tag.tagName + "</td></tr>");
        }
        return htmlString;
    };

    /**
     * Generates a JSON object to pass to PHP for storing
     *
     * @returns {json}: All the tasks that are stored in the TaskList
     */
    this.packageForJson = function () {
        return JSON.stringify(this.allTasks);
    };
}
