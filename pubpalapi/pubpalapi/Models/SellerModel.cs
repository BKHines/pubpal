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
        public PurchasableItemModel[] items { get; set; }
    }
}
