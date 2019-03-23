$(function () {

    //Login();
    
    GetStatus();
    window.setTimeout(function () { DoMagic(); }, 4000);
    
    $(document).on("click", ".fc-button", function () {
        window.setTimeout(function () { DoMagic(); }, 1000);
    });
});


function DoMagic() {

    RemoveClutter();
    FixColors();
    GetOutTime();
    
    $(".CalPopStatuDetails > span").each(function(index, element){
        element.innerText = window.localStorage.getItem(element.innerText);        
    });
    
    $(".CalDayStatusDiv > span").each(function (index, element) {
        
        element.innerText = window.localStorage.getItem(element.innerText);
        
        if (element.innerText.length > 9) {
            element.innerText = element.innerText.substring(0, 9) + "..";
        }
        
        switch (element.innerText) {
            case "ABSENT":
            case "LEAVE":
                $(this).parent().css({ 'border-left': '5px solid red' });
                break;
            case "PRESENT":
                $(this).parent().css({ 'border-left': '5px solid green' });
                break;
            case "Half Day":
                $(this).parent().css({ 'border-left': '5px solid blue' });
                break;
        }
    });
}

function FixColors() {
    $(".CalDayStatusDiv").css({ 'margin': '9px', 'border-left': '5px solid dimgray' });
}


function GetStatus() {
    if (window.localStorage && window.localStorage.getItem("HasDayStatus") == null) {
        $.getJSON('https://myattendance.harbingergroup.com/app/PreDefinedMaster/GetDayStatus', { get_param: 'value' }, function (data) {
            window.localStorage.setItem("HasDayStatus", data != null);
            $.each(data, function (index, element) {
                var code = element.DayStatusCode;
                var description = element.DayStatusDesc;
                window.localStorage.setItem(code, description);
            });
        });
    }
}

function GetOutTime() {

    var url = 'https://myattendance.harbingergroup.com/app/EmployeeDayStatus/GetDayStatusForAMonthNew';
    $.post(url, { date: GetCurrentMonthAndYear, num: '436' }, function (data) {
        var today = GetCurrentDate();
        $.each(data, function (index, element) {
            if (element.OutTime === null || element.OutTime.indexOf('01 Mar 2018') < 0)
                return;

            var outTime = element.OutTime;
            console.log(outTime);
        });
    });
}

function Login() {

    var url = 'https://myattendance.harbingergroup.com/app';
    $.post(url, { txtUserName: 'siddharth.kochar', txtPassword: 'Scknger_4688' }, function (data) {
        //console.log(data);
    });
}

function GetCurrentDate() {
    var today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

function GetCurrentMonthAndYear() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    var today = new Date();
    return monthNames[today.getMonth()] + ' ' + today.getFullYear();
}

function RemoveClutter() {
    $(".CalImgContainer").each(function () {
        $(this).parent().css("height", "");
    });

    $(".CalImgContainer").remove();
    $(".panel panel-danger dashboard-panel").parent().remove();
    $("#divTodayBdayListDash").remove();
    $(".CalPopStatuDetails").each(function(index, element){
        element.innerHTML = element.innerHTML.replace("status: ", "");
    });

    var documentDivs = $("div[class=row]:contains('Organization Document List')");
    documentDivs.each(function(index, element){
        $(this).remove();
    });
}

function SetHoverText(element) {
    var popupDiv = element.parent().find("#popUpDivStatus");
    popupDiv.innerText = window.localStorage.getItem(element.innerText);
}
