using System.Web;
using System.Web.Optimization;

namespace System
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                     "~/Scripts/assets/js/uncompressed/jquery-2.0.3.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                "~/Scripts/assets/js/uncompressed/jquery-ui-1.10.3.custom.js"));

            bundles.Add(new ScriptBundle("~/bundles/template").Include(
                "~/Scripts/jquery.blockUI.js",
                "~/Scripts/assets/js/uncompressed/date-time/daterangepicker.js",
                "~/Scripts/assets/js/uncompressed/date-time/moment.js",
                "~/Scripts/assets/js/jquery.form.js",
                "~/Scripts/assets/js/uncompressed/bootbox.js",
                "~/Scripts/assets/js/uncompressed/jquery.gritter.js",
                "~/Scripts/assets/js/jquery.blockui.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.unobtrusive*",
                "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/validate").Include(
                "~/Scripts/jquery.validate.js"));

            bundles.Add(new ScriptBundle("~/bundles/setting").Include(
                "~/Scripts/assets/js/uncompressed/ace-extra.js"));

            bundles.Add(new ScriptBundle("~/bundles/ace").Include(
                "~/Scripts/assets/js/uncompressed/ace-elements.js",
                "~/Scripts/assets/js/uncompressed/ace.js",
                "~/Scripts/custom.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/assets/js/uncompressed/bootstrap.js"));

            bundles.IgnoreList.Clear();

            bundles.Add(new StyleBundle("~/Content/template/bootstrap").Include(
                "~/Scripts/assets/css/bootstrap.min.css",
                "~/Scripts/assets/css/bootstrap-responsive.min.css"));

            bundles.Add(new StyleBundle("~/Content/template").Include(
                "~/Scripts/assets/css/uncompressed/jquery-ui-1.10.3.custom.css",
                "~/Scripts/assets/css/daterangepicker.css",
                "~/Scripts/assets/css/jquery.gritter.css"));

            bundles.Add(new StyleBundle("~/Content/ace").Include(
                "~/Scripts/assets/css/uncompressed/ace.css",
                "~/Scripts/assets/css/uncompressed/ace-responsive.css",
                "~/Scripts/assets/css/uncompressed/ace-skins.css"));

            bundles.Add(new StyleBundle("~/Content/template/custom").Include(
                "~/Content/customizekendo.css",
                "~/Content/mystyle.css"));

            bundles.Add(new ScriptBundle("~/bundles/kendo/cultures").Include(
                      "~/Scripts/kendo/2015.1.429/cultures/kendo.culture.vi-VN.min.js",
                      "~/Scripts/kendo/2015.1.429/cultures/kendo.culture.lo-LA.min.js",
                      "~/Scripts/kendo/2015.1.429/cultures/kendo.culture.en-US.min.js"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/kendo").Include(
                      "~/Scripts/kendo/2015.1.429/jszip.min.js",
                      "~/Scripts/kendo/2015.1.429/kendo.all.min.js",
                      "~/Scripts/kendo/2015.1.429/kendo.aspnetmvc.min.js",
                      "~/Scripts/kendo.modernizr.custom.js"));

            bundles.Add(new StyleBundle("~/Content/kendo/2015.1.429/kendo").Include(
                     "~/Content/kendo/2015.1.429/kendo.common.min.css",
                     "~/Content/kendo/2015.1.429/kendo.dataviz.min.css",
                     "~/Content/kendo/2015.1.429/kendo.dataviz.bootstrap.min.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}
