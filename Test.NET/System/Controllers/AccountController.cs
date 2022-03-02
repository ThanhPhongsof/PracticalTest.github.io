using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Models;
using System.Repository;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace System.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        // GET: Account

        public UserManager<ApplicationUser> UserManager { get; private set; }
        private readonly Us_UserRepository _userRepon;

        public AccountController()
            : this(new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext())), new Us_UserRepository())
        {
        }

        public AccountController(UserManager<ApplicationUser> userManager, Us_UserRepository userRepon)
        {
            UserManager = userManager;
            _userRepon = userRepon;
        }

        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            UserData.CreateUserLogin();
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginViewModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                string userName = model.UserName.Trim().ToLower();
                var user = _userRepon.GetLogin(userName, model.Password);
                if (user != null)
                {
                    SetupFormsAuthTicket(userName, model.RememberMe);

                    Response.Cookies["login_status"].Value = user.login_status == 2 ? "2" : "1";

                    return RedirectToLocal(returnUrl);
                }
                else
                    ModelState.AddModelError("", "Invalid username or password.");
            }
            // If we got this far, something failed, redisplay form
            return View(model);
        }

        private Us_Users SetupFormsAuthTicket(string userName, bool persistanceFlag)
        {
            Us_Users user = _userRepon.GetByUserName(userName);
            var UserName = user.UserName;
            var userData = UserName.ToString(CultureInfo.InvariantCulture);
            var authTicket = new FormsAuthenticationTicket(1, //version
                                                        userName, // user name
                                                        DateTime.Now,             //creation
                                                        DateTime.Now.AddMinutes(2880), //Expiration
                                                        persistanceFlag, //Persistent
                                                        userData);

            var encTicket = FormsAuthentication.Encrypt(authTicket);
            Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));
            return user;
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);
            else
                return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public ActionResult LogOff()
        {
            Session.RemoveAll();
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }
    }

}