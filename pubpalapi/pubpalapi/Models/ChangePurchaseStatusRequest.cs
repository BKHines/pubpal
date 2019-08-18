using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class ChangePurchaseStatusRequest
    {
        [Required]
        public string purchaseid { get; set; }
        [Required]
        public PurchaseStatus status { get; set; }
        public string message { get; set; }
    }
}
