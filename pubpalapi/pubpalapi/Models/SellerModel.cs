using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class SellerModel : UserModel
    {
        [Required]
        public PlaceModel place { get; set; }
        [Required]
        public PurchasableItemModel[] items { get; set; }
    }
}
