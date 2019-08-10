using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class ChangePasswordRequest
    {
        [Required]
        public string id { get; set; }
        [Required]
        public string newpassword { get; set; }
        [Required]
        public string confirmpassword { get; set; }
    }
}
