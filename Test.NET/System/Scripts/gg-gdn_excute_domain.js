/**
* Không hiển thị những vị trí ở những tên miền có đuôi bên dưới
* @author HVNET - DungNT
*/

// Danh sách những tên miền có đuôi rác

var ten_miens = '.xyz, .tk, .download, .icu, .site, .website, .th, .br, .it, .me, .news, .vip, .tv, .us, .mobi, .online, .host, .google, .info, .biz, .video, .club, .live, .tr, .store, .space, .design, .tech, .asia, .xxx, .cc, .tel, .ws, .name, .bz, .mn, .in, .uk, .top, .pro';

// -------------------------------------------------------


//  Hàm thực thi không hiển thị ở những domain đã định nghĩa
function xoa_nhung_noi_co_ten_mien_o_tren(domain) {
    var placementSelector = AdWordsApp.display().placements()
        .withCondition("PlacementUrl CONTAINS '" + domain + "'")
        .withCondition("CampaignStatus != REMOVED");        //  Đây là dòng lệnh, thông báo cho hệ thống Ads loại trừ

    var placementIterator = placementSelector.get();
    if (placementIterator.length > 0) {
        while (placementIterator.hasNext()) {
            var placement = placementIterator.next();
            var placementUrl = placement.getUrl();
            //Logger.log(placementUrl);

            var campaign = placement.getCampaign();
            var excludeOperation = campaign.display().newPlacementBuilder().withUrl(placementUrl).exclude();
            if (!excludeOperation.isSuccessful()) {
                Logger.log("Could not exclude : " + placementUrl);
            }
        }
    } else {
        Logger.log("Không có gì");
    }
}

function run_khong_hien_thi_ten_mien() {
    ten_miens.split(',').map(function (tld) {
        return tld.trim();
    }).forEach(function (ten_mien) {
        xoa_nhung_noi_co_ten_mien_o_tren(ten_mien);
    });
}

function executeInSequence(sequentialIds, executeSequentiallyFunc) {
    Logger.log('Executing in sequence : ' + sequentialIds);
    sequentialIds.forEach(function (accountId) {
        var account = MccApp.accounts().withIds([accountId]).get().next();
        MccApp.select(account);
        executeSequentiallyFunc();
    });
}

//  Hàm chính để chạy tất cả hàm con
function main() {
    try {
        //  Nếu là tài khoản MCC thì chạy tất cả các tài khoản con nằm trong MCC đó
        //  VD: MCC có 10 tài khoản, thì đoạn code này lấy hết 10 tài khoản đó và cho chạy đồng bộ từng tài khoản. Sau đó, thực hiện hàm run_khong_hien_thi_ten_mien

        var accountIterator = MccApp.accounts().orderBy('Name').get();
        Logger.log('Total number of accounts under MCC : ' + accountIterator.totalNumEntities());

        var accountIds = [];
        while (accountIterator.hasNext()) {
            var account = accountIterator.next();
            accountIds.push(account.getCustomerId());
        }
        var parallelIds = accountIds.slice(0, 50);
        var sequentialIds = accountIds.slice(50);
        // execute accross accounts
        MccApp.accounts()
            .withIds(parallelIds)
            .executeInParallel('run_khong_hien_thi_ten_mien');
        if (sequentialIds.length > 0) {
            executeInSequence(sequentialIds, run_khong_hien_thi_ten_mien);
        }
    } catch (exception) {
        // Không phải MCC thì chạy đoạn lệnh này
        Logger.log('Chạy trên tài khoản con HVNET.');
        run_khong_hien_thi_ten_mien();
    }
}




var config = {
    SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1ZKMoBobL4Jf8vvDruhRaMs5tKA_lbE6DHLALens5ZoI/edit#gid=0',
    PROJECT_NAME: 'Loại trừ vị trí đặt GDN 2020',
}

function getConfigData(spreadsheet) {
    //Specify the title of the list, in which the markers for the “bad”, underperforming domains for the fifth placement selection are indicated in the first column
    var excludeDomainSheet = spreadsheet.getSheetByName('exclude_domain'),
        values = excludeDomainSheet.getSheetValues(1, 1, excludeDomainSheet.getLastRow(), 1);
    config.exclude = [];

    if (typeof values == "object") {
        for (i = 0; i < values.length; i++) {
            config.exclude.push(values[i][0]);
        }
    }

    Logger.log(config.exclude)

    //Indicate the title of the list, in which the markers for the domains that are not included in the statistical analysis
    var exceptDomainSheet = spreadsheet.getSheetByName('except_domain'),
        values = exceptDomainSheet.getSheetValues(1, 1, exceptDomainSheet.getLastRow(), 1);
    config.except = [];

    if (typeof values == "object") {
        for (i = 0; i < values.length; i++) {
            config.except.push(values[i][0]);
        }
    }

    Logger.log(config.except)

    var configSheet = spreadsheet.getSheetByName('config');

    config.email = configSheet.getRange(1, 2, 1, 1).getValues();               // contact email
    config.timeperiod = configSheet.getRange(2, 2, 1, 1).getValue();           // report time period
    config.listCost = configSheet.getRange(3, 2, 1, 1).getValue();             // maximum cost for the first selection of placements
    config.list2ConversionCost = configSheet.getRange(4, 2, 1, 1).getValue();  // maximum cost of conversion for the second selection of placements
    config.list3Impressions = configSheet.getRange(5, 2, 1, 1).getValue();     // minimum number of impressions for the third selection
    config.list3Ctr = configSheet.getRange(6, 2, 1, 1).getValue();             // maximum CTR for the third selection
    config.list4Impressions = configSheet.getRange(7, 2, 1, 1).getValue();     // minimum number of impressions for the fourth selection
    config.list4Ctr = configSheet.getRange(8, 2, 1, 1).getValue()              // minimum CTR for the fourth selection
}

function main() {
    var spreadsheet = SpreadsheetApp.openByUrl(config.SPREADSHEET_URL);
    var curDate = Utilities.formatDate(new Date(), "GMT+7", "dd-MMMM-yyyy");
    getConfigData(spreadsheet);

    // Update the title of the document considering the latest date of the script execution
    spreadsheet.setName("GDN Report " + config.PROJECT_NAME + " " + curDate)

    var body = "<h2>Báo cáo và loại trừ vị trí đặt GDN</h2>";
    body += "<h3>Các vị trí đặt đã tiêu > " + config.listCost + " VND và không ra chuyển đổi:</h3> ";
    body += "<ul>";

    var list = runHightCostAndNoConvertingReport();
    var rows = [];
    for (i = 0; i < list.length; i++) {
        body += "<li>" + list[i].placement + ' - ' + list[i].cost + ' VND ' + "</li>";
    }

    addPlacementList('list1', list, spreadsheet);

    body += "</ul>";
    body += "<h3>Các vị trí đặt có CPA > " + config.list2ConversionCost + " VND:</h3> ";
    body += "<ul>";

    var list2 = runHighCostOfConversionsReport();

    for (i = 0; i < list2.length; i++) {
        body += "<li>" + list2[i].placement + ' Chi tiêu = ' + list2[i].cost + ' VND ' + ' - CPA = ' + list2[i].costperconversion + ' VND ' + "</li>";
    }

    addPlacementList('list2', list2, spreadsheet);

    body += "</ul>";
    body += "<h3>Các vị trí đặt > " + config.list3Impressions + " lần hiển thị và CTR < " + config.list3Ctr + "%:</h3> ";
    body += "<ul>";

    var list3 = runBadCtrNoConversionsReport();

    body += "<li>Số lượng = " + list3.length + "</li>";

    addPlacementList('list3', list3, spreadsheet);

    body += "</ul>";
    body += "<h3>Các vị trí đặt > " + config.list4Impressions + " lần hiển thị và CTR > " + config.list4Ctr + "%:</h3> ";
    body += "<ul>";

    var list4 = runHighCtrReport();

    body += "<li>Số lượng = " + list4.length + "</li>";

    addPlacementList('list4', list4, spreadsheet);

    body += "</ul>";
    body += "<h3>Các vị trí đặt chứa từ khóa không mong muốn:</h3> ";
    body += "<ul>";

    var list5 = gamePlacements();

    body += "<li>Số lượng = " + list5.length + "</li>";

    addPlacementList('list5', list5, spreadsheet);

    body += "</ul>";
    body += "<a href='" + spreadsheet.getUrl() + "'>Mở liên kết chứa báo cáo Google Spreadsheet</a>";

    // Send an email with the selected placements
    if (config.email.length) {
        MailApp.sendEmail(config.email, 'GuuAds - GDN Alerts - ' + config.PROJECT_NAME + " - " + curDate, body, { htmlBody: body });
    }
}

// Function to add the placements in the exclusions
function addPlacementList(nameList, list, spreadsheet) {
    var rows = [],
        sheet,
        range,
        listSharedExcludedPlacementIterator;

    sheet = spreadsheet.getSheetByName(nameList);
    sheet.clear();

    range = sheet.getRange(1, 1, 1, 7).setValues([['Exclusion URL', 'Impressions', 'Clicks', 'CTR', 'Cost', 'Conversions', 'Cost Per Conversion']]);
    range.setBackground("yellow");

    listSharedExcludedPlacementIterator = AdWordsApp.excludedPlacementLists()
        .withCondition("Name CONTAINS '" + nameList + "'").get();

    while (listSharedExcludedPlacementIterator.hasNext()) {
        listSharedExcludedPlacement = listSharedExcludedPlacementIterator.next();
    }

    for (i = 0; i < list.length; i++) {
        listSharedExcludedPlacement.addExcludedPlacement(list[i].placement);
        rows.push([list[i].placement, list[i].impressions, list[i].clicks, list[i].clicks / list[i].impressions * 100 + "%", list[i].cost, list[i].conversions, list[i].costperconversion])
    }

    if (rows.length)
        sheet.getRange(2, 1, rows.length, 7).setValues(rows).sort({ column: 2, ascending: false });
}

function runHightCostAndNoConvertingReport() {

    list = [];

    var periodString = '';

    if (config.timeperiod) {
        periodString = 'DURING ' + config.timeperiod;
        Logger.log(periodString);
    } else {
        Logger.log('DURING ALL TIME');
    }

    // Determine the placements that spent more than X USD and did not bring conversions 
    var report = AdWordsApp.report(
        'SELECT Domain, Clicks, Impressions, CostPerConversion, Conversions, Cost ' +
        'FROM AUTOMATIC_PLACEMENTS_PERFORMANCE_REPORT ' +
        'WHERE Cost > ' + config.listCost * 1000000 + " " +
        'AND Conversions < 1 ' +
        periodString);

    var rows = report.rows();

    while (rows.hasNext()) {

        var row = rows.next();

        var anonymous = row['Domain'].match(new RegExp(config.except.join('|').replace(/\./g, '\\.'), 'g'));
        if (anonymous == null) {
            var placementDetail = new placementObject(row['Domain'], row['Clicks'], row['Impressions'], row['CostPerConversion'], row['Conversions'], row['Cost']);

            list.push(placementDetail);
        }
    }
    return list;
}

function runHighCostOfConversionsReport() {

    list = [];

    var periodString = '';

    if (config.timeperiod) {
        periodString = 'DURING ' + config.timeperiod;
        Logger.log(periodString);
    } else {
        Logger.log('DURING ALL TIME');
    }

    // Determine the placements with the conversion rate higher than X USD
    var report = AdWordsApp.report(
        'SELECT Domain, Clicks, Impressions, CostPerConversion, Conversions, Cost ' +
        'FROM AUTOMATIC_PLACEMENTS_PERFORMANCE_REPORT ' +
        'WHERE CostPerConversion > ' + config.list2ConversionCost * 1000000 + " " +
        'AND Conversions > 1 ' +
        periodString);

    var rows = report.rows();

    while (rows.hasNext()) {

        var row = rows.next();

        var anonymous = row['Domain'].match(new RegExp(config.except.join('|').replace(/\./g, '\\.'), 'g'));
        if (anonymous == null) {

            var placementDetail = new placementObject(row['Domain'], row['Clicks'], row['Impressions'], row['CostPerConversion'], row['Conversions'], row['Cost']);

            list.push(placementDetail);
        }
    }
    return list;
}

function runBadCtrNoConversionsReport() {

    list = [];

    var periodString = '';

    if (config.timeperiod) {
        periodString = 'DURING ' + config.timeperiod;
        Logger.log(periodString);
    } else {
        Logger.log('DURING ALL TIME');
    }

    // Determine the placements without conversions and with more than X impressions and CTR less than Y %:
    var report = AdWordsApp.report(
        'SELECT Domain, Clicks, Impressions, CostPerConversion, Conversions, Cost ' +
        'FROM AUTOMATIC_PLACEMENTS_PERFORMANCE_REPORT ' +
        'WHERE Impressions > ' + config.list3Impressions + " " +
        'AND Ctr < ' + config.list3Ctr * 0.01 + " " +
        'AND Conversions < 1 ' +
        periodString);

    var rows = report.rows();

    while (rows.hasNext()) {

        var row = rows.next();

        var anonymous = row['Domain'].match(new RegExp(config.except.join('|').replace(/\./g, '\\.'), 'g'));
        if (anonymous == null) {
            var placementDetail = new placementObject(row['Domain'], row['Clicks'], row['Impressions'], row['CostPerConversion'], row['Conversions'], row['Cost']);

            list.push(placementDetail);

        }
    }
    return list;
}

function runHighCtrReport() {

    list = [];

    var periodString = '';

    if (config.timeperiod) {
        periodString = 'DURING ' + config.timeperiod;
        Logger.log(periodString);
    } else {
        Logger.log('DURING ALL TIME');
    }

    // Identify the placements without conversions with more than X impressions and CTR more than Y %:
    var report = AdWordsApp.report(
        'SELECT Domain, Clicks, Impressions, CostPerConversion, Conversions, Cost ' +
        'FROM AUTOMATIC_PLACEMENTS_PERFORMANCE_REPORT ' +
        'WHERE Impressions > ' + config.list4Impressions + " " +
        'AND Ctr > ' + config.list4Ctr * 0.01 + " " +
        'AND Conversions < 1 ' +
        periodString);

    var rows = report.rows();

    while (rows.hasNext()) {

        var row = rows.next();

        var anonymous = row['Domain'].match(new RegExp(config.except.join('|').replace(/\./g, '\\.'), 'g'));
        if (anonymous == null) {

            var placementDetail = new placementObject(row['Domain'], row['Clicks'], row['Impressions'], row['CostPerConversion'], row['Conversions'], row['Cost']);

            list.push(placementDetail);
        }
    }
    return list;
}

function gamePlacements() {

    list = [];

    var periodString = '';

    if (config.timeperiod) {
        periodString = 'DURING ' + config.timeperiod;
        Logger.log(periodString);
    } else {
        Logger.log('DURING ALL TIME');
    }

    // Add any placements without conversions, which domain contains the unwanted word:
    var report = AdWordsApp.report(
        'SELECT Domain, Clicks, Impressions, CostPerConversion, Conversions, Cost ' +
        'FROM AUTOMATIC_PLACEMENTS_PERFORMANCE_REPORT ' +
        'WHERE Conversions < 1 ' +
        periodString);

    var rows = report.rows();

    while (rows.hasNext()) {

        var row = rows.next();

        var anonymous = row['Domain'].match(new RegExp(config.except.join('|').replace(/\./g, '\\.'), 'g'));
        if (anonymous == null) {
            var placement = row['Domain'];

            var clicks = row['Clicks'];
            var impressions = row['Impressions'];
            var costperconversion = row['CostPerConversion']
            var conversions = row['Conversions'];
            var cost = row['Cost'];

            var placementDetail = new placementObject(placement, clicks, impressions, costperconversion, conversions, cost);

            if (containsAny(placement.toString(), config.exclude)) {
                var placementDetail = new placementObject(placement, clicks, impressions, costperconversion, conversions, cost);
                list.push(placementDetail);
            }
        }

    }
    return list;
}

function containsAny(str, substrings) {
    for (var i = 0; i != substrings.length; i++) {
        var substring = substrings[i];
        if (str.indexOf(substring) != - 1) {
            return substring;
        }
    }
    return null;
}

function placementObject(placement, clicks, impressions, costperconversion, conversions, cost) {
    this.placement = placement;
    this.clicks = clicks;
    this.impressions = impressions;
    this.costperconversion = costperconversion;
    this.conversions = conversions;
    this.cost = cost;
}
