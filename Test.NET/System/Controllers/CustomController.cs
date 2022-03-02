using Dapper;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Models;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using static System.Status.StatusSumary;

namespace System.Controllers
{
    public class CustomController : Controller
    {
        protected Us_UsersModel currentUser;
        private static string _cookieLangName = "LangForMultiLanguageDemo";
        private static string _login_status = "login_status";
        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            string cultureOnCookie = GetCultureOnCookie(requestContext.HttpContext.Request, "LangForMultiLanguageDemo");
            Thread.CurrentThread.CurrentCulture = Thread.CurrentThread.CurrentUICulture = new CultureInfo(cultureOnCookie);

            base.Initialize(requestContext);
            if (this.User.Identity.IsAuthenticated)
            {
                using (var dbConn = new SqlConnection(Constants.AllConstants().CONNECTION_STRING))
                {
                    dbConn.Open();

                    currentUser = dbConn.QueryFirstOrDefault<Us_UsersModel>("select * from Us_Users where UserName = @UserName", new { @UserName = User.Identity.Name });
                    if (currentUser == null || !currentUser.Active)
                    {
                        AuthenticationManager.SignOut();
                        FormsAuthentication.SignOut();
                    }
                    else
                    {
                        if (currentUser.login_status == 2)
                        {
                            int login_status = GetStatusLoginOnCookie(requestContext.HttpContext.Request, "login_status");
                            if (login_status != 2)
                            {
                                //  Yêu cầu đăng nhập lại
                                AuthenticationManager.SignOut();
                                FormsAuthentication.SignOut();
                            }
                        }
                    }

                    dbConn.Close();
                }
            }
        }

        public static String GetCultureOnCookie(HttpRequestBase request, string valueName)
        {
            var cookie = request.Cookies[valueName];
            string culture = string.Empty;
            if (cookie != null)
                culture = cookie.Value;

            if (string.IsNullOrEmpty(culture))
                culture = "vi-VN";

            return culture;
        }

        public static int GetStatusLoginOnCookie(HttpRequestBase request, string valueName)
        {
            var cookie = request.Cookies[valueName];
            int culture = 1;
            if (cookie != null)
                culture = int.Parse(cookie.Value);
            return culture;
        }
    }
}