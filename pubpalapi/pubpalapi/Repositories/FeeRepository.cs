using pubpalapi.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Repositories
{
    public class FeeRepository
    {
        private FeeDA feeDA;

        public FeeRepository(string dbName, string storeName)
        {
            feeDA = new FeeDA(dbName, storeName);
        }

        public decimal GetFee()
        {
            decimal _fee = 1M;
            var fee = feeDA.GetFee();
            if (fee.feediscount > 0)
            {
                _fee = fee.fee * (decimal)((100 - fee.feediscount) / 100.0);
            }
            return _fee;
        }
    }
}
