using Dapper;
using Dapper.Contrib.Extensions;
using Kendo.Mvc.UI;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Kendo;
using System.Linq;
using System.Models;
using System.Web;
using System.Web.Script.Serialization;
using static System.Status.StatusSumary;

namespace System.Data
{
    public class UserData
    {
        public static DataSource KendoRead(DataSourceRequest request)
        {
            CreateListUser();
            using (var dbConn = new SqlConnection(Constants.AllConstants().CONNECTION_STRING))
            {
                dbConn.Open();

                //  OrderBy string
                string sort = KendoApplyFilter.GetSorts<User>(request);

                string where = " 1=1 ";
                if (request.Filters.Any())
                    where += " AND " + KendoApplyFilter.ApplyFilter(request.Filters[0], "");//  Where Condition

                string query = $"SELECT  * FROM Users WHERE { where } ORDER BY {sort} ";
                var data = dbConn.Query<User>(query);

                if (data.Any())
                {
                    var dt = DateTime.Now;

                    foreach (var item in data)
                    {
                        item.Age = (dt.Year - item.Birthday.Year).ToString();
                        item.NoSubjects = string.IsNullOrEmpty(item.Subjects) ? 0 : item.Subjects.Split(',').ToArray().Count();
                    }
                }

                dbConn.Close();
                var result = new DataSource();
                result.Data = data;
                result.Total = data.Count();

                return result;

            }
        }
        public static MessageStatus CreateOrUpdate(User item)
        {
            try
            {
                using (var dbConn = new SqlConnection(Constants.AllConstants().CONNECTION_STRING))
                {
                    dbConn.Open();

                    item.Name = item.Name;
                    item.Subjects = String.IsNullOrEmpty(item.Subjects) ? "" : item.Subjects;

                    if (CheckId(item.id))
                        dbConn.Insert(item);
                    else
                        dbConn.Update(item);

                    dbConn.Close();
                    return new MessageStatus { success = true };
                }
            }
            catch (Exception ex)
            {
                return new MessageStatus { success = false, message = ex.Message };
            }
        }

        public static bool CheckId(int id)
        {
            return id == 0;
        }
        public static void CreateListUser()
        {
            var dt = GetDate();
            using (var dbConn = new SqlConnection(Constants.AllConstants().CONNECTION_STRING))
            {
                dbConn.Open();

                var data = dbConn.GetAll<User>();

                if (data.Any())
                    return;

                var lst = new List<User>()
                {
                    new User { NRIC = $"S{RandomString(7)}A", Name = "Tom", Gender = 1, Birthday = dt.AddYears(-22), AvailableDate = dt, Subjects = "English,Math" },
                    new User { NRIC = $"S{RandomString(7)}A", Name = "Green", Gender = 2, Birthday = dt.AddYears(-20), AvailableDate = dt, Subjects = "" },
                };

                dbConn.Insert(lst.ToList());

                dbConn.Close();
            }
        }

        private static Random random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static DateTime GetDate()
        {
            return DateTime.Now;
        }

        public static void CreateUserLogin()
        {
            using (var dbConn = new SqlConnection(Constants.AllConstants().CONNECTION_STRING))
            {
                dbConn.Open();

                var data = dbConn.GetAll<Us_Users>();

                if (data.Any())
                    return;

                var lst = new List<Us_Users>()
                {
                    new Us_Users { UserName = "Putin", FullName = "Putin", Password = "Pw123", Active = true },
                    new Us_Users { UserName = "Trump", FullName = "Trump", Password = "Pw345", Active = false },
                };

                dbConn.Insert(lst.ToList());

                dbConn.Close();
            }
        }

    }
}