using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.DataAccess
{
    public class SellerDA : PersonDA<SellerModel>
    {
        public SellerDA(string _dbName, string _storeName) : base(_dbName, _storeName)
        {
        }

        public IEnumerable<SellerModel> GetSellersByLocation(float lat, float lng, int miles)
        {
            var queryText = $"{{'place.location': {{ $geoWithin: {{ $centerSphere: [ [ {lng}, {lat} ], {miles / 3963.2} ] }} }} }}";
            var sellers = GetFromStore(queryText);

            return sellers;
        }

        public IEnumerable<SellerModel> GetSellersByTags(string searchText)
        {
            var queryText = $"{{'tags.tag': {{ $regex: '{searchText}', $options: 'i' }} }}";
            var sellers = GetFromStore(queryText);

            return sellers;
        }

        public new bool UpdatePerson(SellerModel updatedSeller, bool updatePassword)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<SellerModel>(storeName);
                var _seller = (SellerModel)GetPersonById(updatedSeller._id);
                _seller.email = updatedSeller.email;
                if (updatePassword)
                {
                    _seller.password = updatedSeller.password;
                }
                _seller.enabled = updatedSeller.enabled;
                _seller.firstname = updatedSeller.firstname;
                _seller.lastname = updatedSeller.lastname;
                _seller.place = updatedSeller.place;
                _seller.items = updatedSeller.items;
                _seller.tags = updatedSeller.tags;

                coll.ReplaceOne(a => a._id == updatedSeller._id, _seller);
                return true;
            }

            return false;
        }
    }
}
