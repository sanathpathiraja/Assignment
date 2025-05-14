
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace web_api.Models
{
    public class Student
    {
        // Primary key / unique record identifier for the student
        public int RecId { get; set; } = 0;
        [Required(ErrorMessage = "First name is required.")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last name is required.")]
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        [Required(ErrorMessage = "NIC is required.")]
        public string NIC { get; set; }
        [Required(ErrorMessage = "DateOfBirth is required.")]
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }


        public List<IFormFile> Photos { get; set; }

        public List<StudentPhotoDto> ProfilePhoto { get; set; } = new();
    }

    public class StudentPhotoDto
    {
        public int Id { get; set; }
        public byte[] Photo { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }

    public class StudentDto
    {
        public int RecId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string NIC { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }

        // Flattened single photo
        public string PhotoBase64 { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }
}
