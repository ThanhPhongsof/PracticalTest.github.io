
using Dapper;
using System.Data;
using System.Infrastructure;
using System.Linq;
using System.Models;

namespace System.Repository
{
    public class Us_UserRepository : Repository<Us_Users>, IUs_UserRepository
    {
        public Us_Users GetLogin(string userName, string passWord)
        {
            var data = this.Connection.QuerySingleOrDefault<Us_Users>(
                "SELECT * FROM Us_Users WHERE UserName = @userName AND PassWord = @passWord AND Active = @UserStatus",
                new { userName = userName, passWord = passWord, UserStatus = 1 });

            if (data == null)
                return null;

            return data;
        }

        public Us_Users GetByUserName(string userName)
        {
            var data = this.Connection.QuerySingleOrDefault<Us_Users>(
                "SELECT * FROM Us_Users WHERE UserName = @userName",
                new { userName = userName });

            if (data == null)
                return null;

            return data;
        }
    }

    public interface IUs_UserRepository
    {
        /// <summary>
        /// Kiểm tra đăng nhập
        /// </summary>
        /// <returns></returns>
        Us_Users GetLogin(string userName, string passWord);

        /// <summary>
        /// Lấy thông tin người dùng theo username
        /// </summary>
        /// <returns></returns>
        Us_Users GetByUserName(string userName);
    }
}