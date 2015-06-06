$(document).ready(function () {

    // Rotates the second hand
    setInterval(function () {
        var seconds = new Date().getSeconds();
        var sDegree = seconds * 6;
        var sRotate = "rotate(" + sDegree + "deg)";

        $("#sec").css({"-moz-transform": sRotate, "-webkit-transform": sRotate});
    }, 1000);

    // Rotates the minute hand
    setInterval(function () {
        var mins = new Date().getMinutes();
        var mDegree = mins * 6;
        var mRotate = "rotate(" + mDegree + "deg)";

        $("#min").css({"-moz-transform": mRotate, "-webkit-transform": mRotate});
    }, 1000);

    // Rotates the hour hand
    setInterval(function () {
        var hours = new Date().getHours();
        var mins = new Date().getMinutes();
        var hDegree = hours * 30 + (mins / 2);
        var hRotate = "rotate(" + hDegree + "deg)";

        $("#hour").css({"-moz-transform": hRotate, "-webkit-transform": hRotate});
    }, 1000);
});