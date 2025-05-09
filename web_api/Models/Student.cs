namespace web_api.Models
{
    public class Student
    {
        // Primary key or unique record identifier for the student
        public int RecId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string NIC { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public int ProfileImageId { get; set; }
    }
}
