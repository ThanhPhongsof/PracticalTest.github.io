using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Models;
using System.Web;
using System.Web.Mvc;
using static System.Status.StatusSumary;

namespace System.Controllers
{
    [Authorize]
    public class HomeController : CustomController
    {
        public ActionResult Index()
        {
            ViewBag.Subjects = PublicStatus.Subjects();
            ViewBag.Gender = PublicStatus.Gender();
            return View();
        }

        public ActionResult Read([DataSourceRequest] DataSourceRequest request)
        {
            return Json(UserData.KendoRead(request));
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult CreateOrUpdateUsers(User model)
        {
            return Json(UserData.CreateOrUpdate(model), JsonRequestBehavior.AllowGet);
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}