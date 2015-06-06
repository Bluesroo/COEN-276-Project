$(document).ready(function () {
    var editId = null;

    // Refreshes the list every 5 seconds, updating the priority and setting off the alarms
    window.setInterval(function () {
        masterList.refresh();

        // Updates the JSON file
        $.ajax({
            url: '../phpscripts/jsonPush.php',
            data: {
                push: masterList.packageForJson()
            },
            type: 'post',
            success: function (output) {
                console.log("JSON was pushed successfully:\n" + output);
            }
        });
    }, 5000);

    // After clicking the sort button
    $("#sortTasks").click(function () {
        masterList.switchList($("#sortSelect").val());
        $("#todoTasks").html(masterList.generateList());
    });

    // After clicking the add button
    $("#addTask").click(function (e) {
        e.preventDefault();

        var newTag = $("#addTagName").val();
        var newTaskName = $("#addTaskName").val();

        if (newTaskName == "") {
            alert("Task name cannot be null.");
            return;
        }

        var newDueDate = new Date($("#addDate").val()).getTime() / 1000;
        newDueDate = Math.round(newDueDate);
        var newAlarm = getAlarmTime();
        var newTask = new Task(newTaskName, newTag, newDueDate, newAlarm);

        if (editId) {
            newTask.id = editId;
            editId = null;
            editingReset();
        }
        masterList.addTask(newTask);

        $("#addTaskForm")[0].reset();
        $("#todoTasks").html(masterList.generateList());

        // Updates the JSON file
        $.ajax({
            url: '../phpscripts/jsonPush.php',
            data: {
                push: masterList.packageForJson()
            },
            type: 'post',
            success: function (output) {
                console.log("JSON was pushed successfully:\n" + output);
            }
        });
    });

    // After clicking the edit button
    $("#editTask").click(function () {
        var taskToEdit = null;
        masterList.editing = true;

        // Finding the row that was checked
        $("#todoTasks tr").each(function (i, row) {
            var rowHtml = $(row);
            var check = rowHtml.find("input:checked");

            check.each(function () {
                var id = $(rowHtml).attr("id");
                taskToEdit = masterList.getTask(id);
            });
        });

        if (taskToEdit == null) {
            return;
        }
        editId = taskToEdit.id;

        // Pre-populates the add form with the task's values
        $("#addTaskName").val(taskToEdit.taskName);
        // DateTime and alarm time pre-population aren't working
        $("#addTagName").val(taskToEdit.tag.tagName);
        $("#addTask").text("Apply Edit");
        $("#removeTask").text("Cancel Edit");
    });

    // After selecting a task and clicking the remove button
    $("#removeTask").click(function (e) {
        e.preventDefault();

        // Cancels the editing
        if (editId) {
            masterList.editing = false;
            editId = null;
            editingReset();
            return;
        }

        // Finding the row that was checked
        $("#todoTasks tr").each(function (i, row) {
            var rowHtml = $(row);
            var check = rowHtml.find("input:checked");

            check.each(function () {
                var finishedTaskId = $(rowHtml).attr("id");
                masterList.finishTask(finishedTaskId);
            });
        });

        $("#todoTasks").html(masterList.generateList());
        $("#finishedTasks").html(masterList.generateFinishedList());

        $.ajax({
            url: '../phpscripts/jsonPush.php',
            data: {
                push: masterList.packageForJson()
            },
            type: 'post',
            success: function (output) {
                console.log("JSON was pushed successfully:\n" + output);
            }
        });
    });
});

/**
 * Resets the form after editing
 */
function editingReset() {
    $("#addTask").text("Add Task");
    $("#removeTask").text("Remove Task");
    $("#addTaskName").val("");
    $("#addTagName").val("");
}

/**
 * Takes the alarm parameters from the add form and converts it to the chosen units
 *
 * @returns {*}: if the user wants an alarm it returns the alarm time
 *               if the user doesn't want an alarm it returns false
 */
function getAlarmTime() {
    if ($("#addAlarm:checkbox:checked").length > 0) {
        var alarmTime = $("#addAlarmDate").val();
        var timeUnit = $("#timeSelect").val();
        var multiplier;

        if (timeUnit == "minutes") {
            multiplier = 60;
        }
        else if (timeUnit == "hours") {
            multiplier = 3600;
        }
        else {
            multiplier = 86400;
        }
        return alarmTime * multiplier;
    }
    return false;
}
