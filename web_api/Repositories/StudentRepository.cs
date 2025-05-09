using Dapper;
using System.Data;
using web_api.Context;
using web_api.Models;
using web_api.Repositories.Interfaces;

namespace web_api.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        // Injected DapperContext to manage database connections
        private readonly DapperContext _context;

        // Constructor receives DapperContext via dependency injection
        public StudentRepository(DapperContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all student records by executing the 'spGetStudents' stored procedure.
        /// </summary>
        /// <returns>A collection of Student objects.</returns>
        public async Task<IEnumerable<Student>> GetStudents()
        {
            // Name of the stored procedure that fetches students
            var spQuery = "spGetStudents";

            // Create a new SQL connection using DapperContext
            using var connection = _context.CreateConnection();

            // Execute the stored procedure and map the results to a list of Student objects
            var students = await connection.QueryAsync<Student>(
                spQuery,
                commandType: CommandType.StoredProcedure);

            // Return the list of students
            return students;
        }
    }
}
