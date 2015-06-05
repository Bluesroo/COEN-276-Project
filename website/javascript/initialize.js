// Runs upon opening the website

// The main data structure that stores and processes the tasks
var masterList = new TasksLists();

// Does the initial list load from taskList.json
$.when($.ajax({
    url: '../phpscripts/jsonPull.php',
    type: 'get',
    success: function (output) {
        var tasks = jQuery.parseJSON(output);
        for (var i in tasks) {
            masterList.addTask(new Task(tasks[i].taskName, tasks[i].tag, tasks[i].dueDate, tasks[i].alarmTime));
        }
    }
})).then(function () {
    $("#todoTasks").html(masterList.generateList());
    $("#finishedTasks").html(masterList.generateFinishedList());
    $("#addTagName").html(masterList.generateTagOptions());
    $("#sortSelect").html(masterList.generateTagOptions());
});
