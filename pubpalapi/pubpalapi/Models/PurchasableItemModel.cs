using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace pubpalapi.Models
{
    public class PurchasableItemModel
    {
        public string id { get; set; }
        [Required]
        public string name { get; set; }
        public string description { get; set; }
        [Required]
        public decimal price { get; set; }
        [Required]
        public string baseingredient { get; set; }
        
        public string category { get; set; }
        public IngredientModel[] ingredients { get; set; }
        public bool unavailable { get; set; }
    }

    public class IngredientModel
    {
        [Required]
        public int id { get; set; }
        [Required]
        public string ingredient { get; set; }
        [Required]
        public decimal upcharge { get; set; }
        [Required]
        public string category { get; set; }

        public string description { get; set; }
        public bool unavailable { get; set; }
    }
}
