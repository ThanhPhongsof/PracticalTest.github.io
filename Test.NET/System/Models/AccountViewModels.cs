using System.ComponentModel.DataAnnotations;

namespace System.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    public class ExternalLoginViewModel
    {
        [Display(Name = "ReturnUrl")]
        public string ReturnUrl { get; set; }

        [Required]
        [Display(Name = "Action")]
        public string Action { get; set; }
    }
}