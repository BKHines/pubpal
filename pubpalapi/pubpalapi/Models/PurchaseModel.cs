using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace pubpalapi.Models
{
    public class PurchaseRequestWithService
    {
        public PurchaseModel purchase { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PurchaseServiceType servicetype { get; set; }
    }

    public class PurchaseModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        [Required]
        public string userid { get; set; }
        [Required]
        public string customername { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        [Required]
        public string sellerid { get; set; }
        [Required]
        public string itemname { get; set; }
        [Required]
        public string[] ingredients { get; set; }
        [Required]
        public decimal price { get; set; }
        [Required]
        public decimal fee { get; set; }
        [Required]
        public bool feewaived { get; set; }
        [Required]
        public decimal tip { get; set; }
        public string category { get; set; }
        public string instructions { get; set; }
        [BsonRepresentation(BsonType.String)]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [Required]
        public PurchaseStatus currentstatus { get; set; }
        [Required]
        public PurchaseHistory[] purchasehistory { get; set; }
    }

    public class PurchaseHistory
    {
        [BsonRepresentation(BsonType.String)]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [Required]
        public PurchaseStatus purchasestatus { get; set; }
        [Required]
        public string statusdate { get; set; }
        public string message { get; set; }
    }

    public class CartPurchaseModel : PurchaseModel
    {
        public string cartid { get; set; }
    }

    public enum PurchaseStatus
    {
        ordered,
        accepted,
        inprogress,
        ready,
        pickedup,
        cancelled
    }

    public enum PurchaseServiceType
    {
        paypal
    }

    public class PurchaseCreateWithResponse
    {
        public string purchaseid { get; set; }
        public string responseurl { get; set; }
    }
}
