using Microsoft.Data.SqlClient;
using System.Data;

namespace web_api.Context
{
    public class DapperContext
    {
        // Holds the application's configuration settings (e.g., from appsettings.json)
        private readonly IConfiguration _configuration;

        // Stores the SQL Server connection string retrieved from the configuration
        private readonly string _connectionString;

        // Constructor that receives the IConfiguration through dependency injection
        public DapperContext(IConfiguration configuration)
        {
            _configuration = configuration;

            // Get the connection string named "DefaultConnection" from appsettings.json
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        // Creates and returns a new SqlConnection instance using the connection string
        public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
    }
}
