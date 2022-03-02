using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System
{
    public class Constants
    {
        private static Constants m_Constants;
        public string CONNECTION_STRING;

        public Constants()
        {
            CONNECTION_STRING = "Server=.;Database=Test.NET;Integrated Security=true;";
        }

        public static Constants AllConstants()
        {
            if (m_Constants == null)
                m_Constants = new Constants();
            return m_Constants;
        }

        public static void Refresh()
        {
            if (m_Constants != null)
            {
                m_Constants = null;
                Constants.AllConstants();
            }
        }
    }
}