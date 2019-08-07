using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class PlaceModel
    {
        [Required]
        public string name { get; set; }
        [Required]
        public AddressModel address { get; set; }

        public string description { get; set; }
    }
}
