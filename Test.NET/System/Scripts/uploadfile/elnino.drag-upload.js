/*
hdGuidName => HiddenField chứa ds guidName - tên mã hóa luu tren HDD
hdFileName => HiddenField chứa ds fileName - tên hiển thị của file
*/
var pnlContainer = '';
var pnlDragUpload = '';
var fileUploadControl = '';
var isFullUpload = '2';
//$(document).ready(function () {
//    ReloadDragUpload();
//});

$.fn.bindDragUpload = function () {
    $(this).html5Uploader({
        name: "upfilethum",
        postUrl: "/Tool/Upload.ashx?isfll=" + isFullUpload,
        onServerLoadStart: function (e, file) { // dau tien
            $.blockUI({ message: '<h3><i class="icon-spinner icon-spin blue bigger-125" style="font-size:30px;"></i> Vui lòng chờ chút...</h3>', css: { color: '#fff' } });
        },
        onServerProgress: function (e, file) {// thu 2
            $.blockUI({ message: '<h3><i class="icon-spinner icon-spin blue bigger-125" style="font-size:30px;"></i> Vui lòng chờ chút...</h3>', css: { color: '#fff' } });
        },
        onSuccess: function (e, file) {
            var data = $.parseJSON(e.currentTarget.response);
            if (data != '-1') {
                // add file GUID moi vao mảng
                var fileGuidList = $('#hdGuidName').val();
                // add file NAME moi vao mang
                var fileNameList = $('#hdFileName').val();
                // image text html
                var imgHTML = '';
                for (i = 0; i < data.length; i++) {
                    var filePath = data[i].uploadPath;
                    var fileName = data[i].fileName;
                    var fileGuid = data[i].guidName;
                    imgHTML += '<img src="' + filePath + '" alt="' + fileName + '" width="100%" style="margin-top: 4px;" />';
                    fileGuidList = fileGuid;
                    fileNameList = fileName;
                }

                $('#' + pnlContainer).html(imgHTML);

                $('#hdGuidName').val(fileGuidList);
                $('#hdFileName').val(fileNameList);
                $('#' + pnlContainer).removeAttr('style');
            }
            if (data == '-1') {
                alert('Hết phiên đăng nhập. Vui lòng đăng nhập lại.');
            }
            $.unblockUI();
        }
    });
}

// gắn action kéo thả khi page_load
function ReloadDragUpload() {
    $('#' + pnlDragUpload).bindDragUpload();
    $('#' + fileUploadControl).bindDragUpload();
}

function RemoveFileFromList(removeName, hdFileName) {
    var curentFileList = $('#' + hdFileName).val();
    // chua co file thi ko xu ly
    if (curentFileList.length > 0) {
        var valResult = '';
        // dua vao mang
        var arr = curentFileList.split(':');
        // lap tung phan tu mang
        for (i = 0; i < arr.length; i++) {
            // lay ID
            var itName = arr[i];
            if (removeName != itName) {
                valResult += valResult.length > 0 ? ':' : '';
                valResult += itName;
            }
        }
        $('#' + hdFileName).val(valResult);
    }
}

$(document).on('click', 'span.cmd-del-file', function () {
    if (window.confirm('Bạn chắc chắn muốn xóa file này?') == false) {
        return false;
    }
    else {
        // bat loading
        ShowLoading();
        // lay ten file GUI cần xóa
        var fileGUID = $(this).attr('data-val');
        // lay ten file NAME cần xóa
        var fileName = $(this).attr('data-rel');
        // danh dau ket quả trả ve
        var boolRlt = false;
        // bat dau xoa file
        $.ajax({
            url: '/Tool/Upload.ashx?f=' + fileGUID + '&ac=DELETE',
            cache: false,
            success: function (result) {
                if (result == 1) boolRlt = true;
            },
            async: false
        });

        // tắt loading
        HideLoading();
        // if xoa file thành công
        if (boolRlt) {
            // remove parent div chứa thông tin file
            $(this).parent('div').remove();
            // xoa file GUID khoi ds
            RemoveFileFromList(fileGUID, 'hdGuidName');
            // xoa file NAME khoi ds
            RemoveFileFromList(fileName, 'hdFileName');

        }
    }
});