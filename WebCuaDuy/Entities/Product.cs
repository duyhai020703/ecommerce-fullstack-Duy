using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebCuaDuy.Entities // Hoặc namespace EcommerceAPI.Entities tùy tên project bạn đặt
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public required string Name { get; set; }

        // URL thân thiện cho SEO (vd: ao-thun-coolmate)
        public string Slug { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Price { get; set; }

        public string? Description { get; set; }
        public string? ImageUrl { get; set; }

        // Liên kết sang bảng Category
        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; }

        // Danh sách biến thể (Embedding)
        public List<ProductVariant> Variants { get; set; } = new();

        public bool IsActive { get; set; } = true; // Ẩn hiện sản phẩm
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}