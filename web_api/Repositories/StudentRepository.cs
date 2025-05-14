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

            var studentDict = new Dictionary<int, Student>();

            // Execute the stored procedure and map the results to a list of Student objects
            var students = await connection.QueryAsync<Student, StudentPhotoDto, Student>(
                spQuery,
                (student, photo) =>
                {
                    if (!studentDict.TryGetValue(student.RecId, out var currentStudent))
                    {
                        currentStudent = student;
                        currentStudent.ProfilePhoto = new List<StudentPhotoDto>();
                        studentDict.Add(currentStudent.RecId, currentStudent);
                    }

                    if (photo != null && photo.Photo != null)
                    {
                        currentStudent.ProfilePhoto.Add(photo);
                    }

                    return currentStudent;
                },
                splitOn: "PhotoId",
                commandType: CommandType.StoredProcedure
            );

            // Return the list of students
            return studentDict.Values;
        }

        public async Task<int> AddStudentWithPhotos(Student student)
        {
            // Create a new SQL connection
            using var connection = _context.CreateConnection();

            // Ensure the connection is open before beginning the transaction
            if (connection.State != ConnectionState.Open)
                connection.Open();

            using var transaction = connection.BeginTransaction();

            try
            {
                // Step 1: Call stored procedure to insert the student
                var spQuery = "spAddStudent";
                var parameters = new DynamicParameters();
                parameters.Add("FirstName", student.FirstName);
                parameters.Add("LastName", student.LastName);
                parameters.Add("Mobile", student.Mobile);
                parameters.Add("Email", student.Email);
                parameters.Add("NIC", student.NIC);
                parameters.Add("DateOfBirth", student.DateOfBirth);
                parameters.Add("Address", student.Address);
                parameters.Add("NewStudentId", dbType: DbType.Int32, direction: ParameterDirection.Output);

                await connection.ExecuteAsync(
                    spQuery,
                    parameters,
                    transaction: transaction,
                    commandType: CommandType.StoredProcedure
                );

                // Retrieve the newly created student ID
                int newStudentId = parameters.Get<int>("NewStudentId");

                // Step 2: Upload photos if any
                if (student.Photos != null && student.Photos.Any())
                {
                    foreach (var photo in student.Photos)
                    {
                        // Convert file to byte array
                        using var ms = new MemoryStream();
                        await photo.CopyToAsync(ms);
                        byte[] photoBytes = ms.ToArray();

                        // Call stored procedure to insert photo
                        string spAddPhoto = "spAddStudentPhoto";

                        var photoParams = new DynamicParameters();
                        photoParams.Add("StudentId", newStudentId);
                        photoParams.Add("Photo", photoBytes);
                        photoParams.Add("FileName", photo.FileName);
                        photoParams.Add("ContentType", photo.ContentType);

                        await connection.ExecuteAsync(
                            spAddPhoto,
                            photoParams,
                            transaction: transaction,
                            commandType: CommandType.StoredProcedure
                        );
                    }
                }

                // Commit the transaction after all inserts are successful
                transaction.Commit();
                return newStudentId;
            }
            catch
            {
                // Rollback transaction in case of any error
                transaction.Rollback();
                throw;
            }
        }

        public async Task<bool> UpdateStudentWithPhotos(Student student)
        {
            using var connection = _context.CreateConnection();

            if (connection.State != ConnectionState.Open)
                connection.Open();

            using var transaction = connection.BeginTransaction();

            try
            {
                // Step 1: Update student record
                var spQuery = "spUpdateStudent";
                var parameters = new DynamicParameters();
                parameters.Add("RecId", student.RecId);
                parameters.Add("FirstName", student.FirstName);
                parameters.Add("LastName", student.LastName);
                parameters.Add("Mobile", student.Mobile);
                parameters.Add("Email", student.Email);
                parameters.Add("NIC", student.NIC);
                parameters.Add("DateOfBirth", student.DateOfBirth);
                parameters.Add("Address", student.Address);

                var rowsAffected = await connection.ExecuteAsync(
                    spQuery,
                    parameters,
                    transaction: transaction,
                    commandType: CommandType.StoredProcedure
                );

                // Step 2: Optional - Delete existing photos
               
                    var deletePhotoSp = "spDeleteStudentPhotos";
                    var deleteParams = new DynamicParameters();
                    deleteParams.Add("StudentId", student.RecId);

                    await connection.ExecuteAsync(
                        deletePhotoSp,
                        deleteParams,
                        transaction: transaction,
                        commandType: CommandType.StoredProcedure
                    );

                if (student.Photos != null && student.Photos.Any())
                {
                    // Step 3: Insert new photos
                    foreach (var photo in student.Photos)
                    {
                        using var ms = new MemoryStream();
                        await photo.CopyToAsync(ms);
                        byte[] photoBytes = ms.ToArray();

                        var addPhotoSp = "spAddStudentPhoto";
                        var photoParams = new DynamicParameters();
                        photoParams.Add("StudentId", student.RecId);
                        photoParams.Add("Photo", photoBytes);
                        photoParams.Add("FileName", photo.FileName);
                        photoParams.Add("ContentType", photo.ContentType);

                        await connection.ExecuteAsync(
                            addPhotoSp,
                            photoParams,
                            transaction: transaction,
                            commandType: CommandType.StoredProcedure
                        );
                    }
                }

                transaction.Commit();

                // Return true if update affected at least one row
                return rowsAffected > 0;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }


        public async Task<bool> DeleteStudentAsync(int RecId)
        {
            using var connection = _context.CreateConnection();

            if (connection.State != ConnectionState.Open)
                connection.Open();

            var parameters = new DynamicParameters();
            parameters.Add("RecId", RecId);

            var rowsAffected = await connection.ExecuteAsync(
                "spDeleteStudent",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

    }

}
