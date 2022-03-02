using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System.Models
{
    [Table("Us_Users")]
    public class Us_Users
    {
        [Key]
        public int id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public bool Active { get; set; }

        [Computed]
        public byte login_status { get; set; }
    }

    public class Us_UsersModel
    {
        public string UserName { get; set; }
        public string StartOrderCode { get; set; }
        public string FullName { get; set; }
        public string Groups { get; set; }
        public bool Active { get; set; }
        public bool AllowPermision { get; set; }
        public byte login_status { get; set; }
    }
}