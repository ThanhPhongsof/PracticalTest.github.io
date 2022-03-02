using Microsoft.AspNet.Identity.EntityFramework;

namespace System.Models
{
    public class ApplicationUser : IdentityUser
    {
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base(Constants.AllConstants().CONNECTION_STRING)
        {
        }
    }
}