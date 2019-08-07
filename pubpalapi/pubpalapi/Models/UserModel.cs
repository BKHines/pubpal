using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class UserModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string firstname { get; set; }
        [Required]
        public string lastname { get; set; }

        public string password { get; set; }
        public bool enabled { get; set; }
    }
}
