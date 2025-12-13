using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Entities // Hoặc namespace EcommerceAPI.Entities tùy tên project bạn đặt
{
    public class Product
    {
        [BsonId] // Đánh dấu đây là Khóa chính (Primary Key)
        [BsonRepresentation(BsonType.ObjectId)] // Tự động chuyển đổi ObjectId sang string cho dễ dùng
        public string? Id { get; set; }

        [BsonElement("Name")]
        public required string Name { get; set; }

        public decimal Price { get; set; }

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public string? Category { get; set; }
    }
}