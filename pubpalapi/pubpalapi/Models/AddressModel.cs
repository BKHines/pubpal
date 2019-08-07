using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class AddressModel
    {
        [Required]
        public string address { get; set; }
        [Required]
        public string city { get; set; }
        [Required]
        public string state { get; set; }
        [Required]
        public string zip { get; set; }
        [Required]
        public float latitude { get; set; }
        [Required]
        public float longitude { get; set; }

        public string county { get; set; }
        public string country { get; set; }
    }
}
