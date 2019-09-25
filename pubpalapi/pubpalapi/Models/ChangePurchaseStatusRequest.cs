using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class ChangePurchaseStatusRequest
    {
        [Required]
        public string purchaseid { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [Required]
        public PurchaseStatus status { get; set; }
        public string message { get; set; }
    }
}
