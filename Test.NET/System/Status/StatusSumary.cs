using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System.Status
{
    public class StatusSumary
    {
        public class MessageStatus
        {
            public bool success { get; set; }
            public string message { get; set; }
            public int total { get; set; }
            public object objectdata { get; set; }
        }

        public class PublicStatus
        {
            public int Value { get; set; }
            public string Text { get; set; }
            public string Password { get; set; }
            public bool Active { get; set; }

            public static List<PublicStatus> Gender()
            {
                var listStatus = new List<PublicStatus>();
                listStatus.Add(new PublicStatus() { Value = 1, Text = "M" });
                listStatus.Add(new PublicStatus() { Value = 2, Text = "F" });
                return listStatus;
            }
            public static List<PublicStatus> Subjects()
            {
                var listStatus = new List<PublicStatus>();
                listStatus.Add(new PublicStatus() {  Text = "English" });
                listStatus.Add(new PublicStatus() {  Text = "Math" });
                listStatus.Add(new PublicStatus() {  Text = "Science" });
                return listStatus;
            }
        }

    }
}