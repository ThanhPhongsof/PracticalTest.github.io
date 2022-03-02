var ws;
//document.addEventListener("DOMContentLoaded", function(event) {
//    //Do work
//    document.getElementById('connect').click();
//});

$(document).ready(function () {
    if (!window.WebSocket) {
        alert("Lỗi: Vui lòng liên hệ admin để hỗ trợ!");
    }

    username = getCookie("username");
    if (username != "Telesale") {
        document.getElementById('connect').click();
    }
    
});

function log(text) {
    username = getCookie("username");
    if (text.indexOf(username) !== -1)
        //$("log").innerHTML = (!Object.isUndefined(text) && text !== null ? text.escapeHTML() : "null") + $("log").innerHTML;
        $("#log").append(text)
}

$("#disconnect").click(function (e) {
    /*e.stop();
   if (ws) {
   ws.close();
   ws = null;
   }*/
    username = getCookie("username");

    sendMessage("ack:" + username.replace(" ", "") + ";duan:shop.hvnet.vn");
});

$("#connect").click(function () {
    //e.stop();
    ws = new WebSocket($("#uri").val());
    ws.onopen = function () {
        username = getCookie("username")
        log(username + " đã kết nối!");
    }
    ws.onmessage = function (e) {

        if (e.data.indexOf("incoming") != -1) {
            //cuộc gọi tới
            username = getCookie("username");
            var values = e.data.split(';');

            var _phone = values[0].replace("incoming:", "");
            var _user = values[1].replace("user:", "").replace(" ", "");
            var _duAn = values[2].replace("duan:", "");

            //  Hiện tại, chỉ cho phép dự án rod, chỉ màn hình bán hàng và theo username
            if (_user == username && window.location.pathname.split("/")[1] == 'telesales') {
                $.gritter.add({
                    title: 'Cuộc gọi đến: ' + _phone,
                    text: '<p class=""><button class="btn btn-small btn-success" onclick=\'CallIncoming("' + _phone + '")\'>Tìm khách hàng</button> <button class="btn btn-small gritter-close closepopupincoming">Bỏ qua</button></p>',
                    sticky: false,
                    time: 12000,
                    class_name: 'gritter-light'
                });
            }
        }
    }
    ws.onclose = function () {
        log("[Mất kết nối! Vui lòng click vào nút kết nối lại!]\n");
        $('#connect').prop('disabled', false);
        $('#disconnect').prop('disabled', true);
        ws = null;
    }
    $('#connect').prop('disabled', true);
    $('#disconnect').prop('disabled', false);
});




function sendMessage(message) {
    if (ws) {
        ws.send(message);
    }
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

