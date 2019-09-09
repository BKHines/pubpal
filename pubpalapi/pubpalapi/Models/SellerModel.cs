using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class SellerModel : PersonModel
    {
        [Required]
        public PlaceModel place { get; set; }
        
        public decimal fee { get; set; }
        public PurchasableItemModel[] items { get; set; }

        public SellerTagModel[] tags { get; set; }
    }

    public class SellerTagModel
    {
        [Required]
        public string tag { get; set; }
        [Required]
        public string userid { get; set; }
    }
}
