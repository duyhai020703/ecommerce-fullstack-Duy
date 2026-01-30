using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebCuaDuy.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public required string Email { get; set; }
        public string PasswordHash { get; set; } // Mật khẩu đã mã hóa
        public string FullName { get; set; }
        public string Role { get; set; } = "Customer"; // "Admin" hoặc "Customer"

        // Một người có thể lưu nhiều địa chỉ nhận hàng
        public List<Address> SavedAddresses { get; set; } = new();
    }
}