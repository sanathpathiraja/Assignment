using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using web_api.Repositories.Interfaces;

namespace web_api.Controllers
{
    [ApiController]
    public class StudentsController : ControllerBase
    {
        // Dependency-injected repository interface to access student data
        private readonly IStudentRepository _repository;

        // Constructor injection of the student repository
        public StudentsController(IStudentRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("api/Students/GetStudents")]
        public async Task<IActionResult> GetStudents()
        {
            try
            {
                // Attempt to retrieve student data from the repository
                var students = await _repository.GetStudents();

                // Return HTTP 200 OK with student list as JSON
                return Ok(students);
            }
            catch (SqlException sqlEx)
            {
                // Catch SQL-related errors (e.g., connection, timeout, syntax)
                // Log the error here if a logger is available
                return StatusCode(500, "Database error occurred.");
            }
            catch (Exception ex)
            {
                // Catch any other unexpected exceptions
                // Log the error here if a logger is available
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}
