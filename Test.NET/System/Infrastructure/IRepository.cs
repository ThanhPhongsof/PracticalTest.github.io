using System.Collections.Generic;
using System.Threading.Tasks;

namespace System.Infrastructure
{
    public interface IRepository<T> where T : class, new()
    {
    }
}