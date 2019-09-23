using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PubPalAPI.Models
{
    public class SettingsModel
    {
        public string ConnectionString;
        public string Database;
        public string UserStoreName;
        public string SellerStoreName;
        public string PurchaseStoreName;
        public string FeeStoreName;
        public string CartStoreName;
        public bool IsDev;
    }
}
