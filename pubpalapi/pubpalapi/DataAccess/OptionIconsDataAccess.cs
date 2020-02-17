using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace pubpalapi.DataAccess
{
    public class OptionIconsDataAccess
    {
        public string[] optionIcons;
        public OptionIconsDataAccess()
        {
            string optionicons = string.Empty;
            if (File.Exists(@".\appcontent\definitions\icons.json"))
            {
                optionicons = File.ReadAllText(@".\appcontent\definitions\icons.json");
            }
            optionIcons = JsonSerializer.Deserialize<string[]>(optionicons);
        }
    }
}
