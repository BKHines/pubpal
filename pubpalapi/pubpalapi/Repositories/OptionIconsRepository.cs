using pubpalapi.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Repositories
{
    public class OptionIconsRepository
    {
        private OptionIconsDataAccess oiDA;

        public OptionIconsRepository()
        {
            oiDA = new OptionIconsDataAccess();
        }


        public string[] GetOptionIcons()
        {
            return oiDA.optionIcons;
        }

    }
}
