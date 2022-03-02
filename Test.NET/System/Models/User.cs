using System.ComponentModel.DataAnnotations;
using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;

namespace System.Models
{
    public class User
    {
        public int id { get; set; }
        public string NRIC { get; set; }
        public string Name { get; set; }
        public byte Gender { get; set; }
        public DateTime Birthday { get; set; }
        public DateTime AvailableDate { get; set; }
        public string Subjects { get; set; }

        [Computed]
        public string Age { get; set; }
        [Computed]
        public int NoSubjects { get; set; }
    }

    public class SubjectsViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}