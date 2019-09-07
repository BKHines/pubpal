using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class UserModel : PersonModel
    {
        [Required]
        public int waivedfeetokens { get; set; }

        public string[] favorites { get; set; }
    }
}
