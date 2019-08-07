using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace pubpalapi.Models
{
    public class PurchasableItemModel
    {
        [Required]
        public string name { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public decimal price { get; set; }
        [Required]
        public string baseingredient { get; set; }
        [Required]
        public bool requireingredients { get; set; }

        public IngredientModel[] ingredients { get; set; }
    }

    public class IngredientModel
    {
        [Required]
        public string ingredient { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public decimal upcharge { get; set; }
    }
}
