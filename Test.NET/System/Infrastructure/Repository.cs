using System.Data;
using System.Data.SqlClient;


namespace System.Infrastructure
{
    public class Repository<T> : IRepository<T> where T : class, new()
    {
        private readonly string _connectionString;

        protected Repository()
        {
            _connectionString = Constants.AllConstants().CONNECTION_STRING;
        }

        public IDbConnection Connection => new SqlConnection(_connectionString);
    }
}