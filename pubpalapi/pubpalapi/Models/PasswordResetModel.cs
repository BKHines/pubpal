using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class PasswordResetRequestModel
    {
        [Required]
        public string email { get; set; }
        [Required]
        public string ip { get; set; }
    }

    public class ChangePasswordResetRequest
    {
        [Required]
        public string email { get; set; }
        [Required]
        public string newpassword { get; set; }
        [Required]
        public string confirmpassword { get; set; }
        [Required]
        public string resetid { get; set; }
        [Required]
        public string ip { get; set; }
    }

    public class PasswordResetModel
    {
        [Required]
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        public string personemail { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string personid { get; set; }
        public string temporarypassword { get; set; }
        public PasswordResetStatusModel requeststatus { get; set; }
        public PasswordResetFinishStatusModel completestatus { get; set; }
        public PasswordResetFinishStatusModel cancelledstatus { get; set; }
    }

    public class PasswordResetStatusModel
    {
        [Required]
        public string requestip { get; set; }
        [Required]
        public DateTime requesttimestamp { get; set; }
    }

    public class PasswordResetFinishStatusModel : PasswordResetStatusModel
    {
        [Required]
        public bool finished { get; set; }
    }
}
