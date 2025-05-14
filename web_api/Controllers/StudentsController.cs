using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using web_api.Models;
using web_api.Repositories;
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

                // Map to DTOs and convert photo to base64
                var studentDtos = students.Select(s =>
                {
                    var photo = s.ProfilePhoto?.FirstOrDefault();

                    return new StudentDto
                    {
                        RecId = s.RecId,
                        FirstName = s.FirstName,
                        LastName = s.LastName,
                        Mobile = s.Mobile,
                        Email = s.Email,
                        NIC = s.NIC,
                        DateOfBirth = s.DateOfBirth,
                        Address = s.Address,
                        FileName = photo?.FileName,
                        ContentType = photo?.ContentType,
                        PhotoBase64 = photo?.Photo != null
                            ? $"data:{photo.ContentType};base64,{Convert.ToBase64String(photo.Photo)}"
                            : null
                    };
                });

                // Return HTTP 200 OK with student list as JSON
                return Ok(studentDtos);
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

        [HttpPost]
        [Route("api/Students/AddStudent")]
        public async Task<IActionResult> AddStudent([FromForm] Student student)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                int studentId = await _repository.AddStudentWithPhotos(student);

                return Ok(new { Message = "Student added successfully", StudentId = studentId });
            }
            catch (SqlException)
            {
                return StatusCode(500, "A database error occurred.");
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPut]
        [Route("api/Students/EditStudent")]
        public async Task<IActionResult> EditStudent([FromForm] Student student)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                bool status = await _repository.UpdateStudentWithPhotos(student);

                return Ok(new { Message = "Student record updated successfully", status = status });
            }
            catch (SqlException)
            {
                return StatusCode(500, "A database error occurred.");
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpDelete]
        [Route("api/Students/DeleteStudent")]
        public async Task<IActionResult> DeleteStudent(int recId)
        {
            var success = await _repository.DeleteStudentAsync(recId);

            if (!success)
                return NotFound(new { message = "Student not found or already deleted." });

            return Ok(new { message = "Student deleted successfully." });
        }


    }
}
