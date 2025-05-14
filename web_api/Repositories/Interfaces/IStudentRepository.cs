using web_api.Models;

namespace web_api.Repositories.Interfaces
{
    // Interface for the student repository
    // Defines contract for data access methods related to Student entities
    public interface IStudentRepository
    {
        /// <summary>
        /// Asynchronously retrieves a list of all students from the database.
        /// </summary>
        /// <returns>A Task containing an IEnumerable of Student objects.</returns>
        Task<IEnumerable<Student>> GetStudents();
        Task<int> AddStudentWithPhotos(Student student);
        Task<bool> UpdateStudentWithPhotos(Student student);
        Task<bool> DeleteStudentAsync(int recId);
    }
}
