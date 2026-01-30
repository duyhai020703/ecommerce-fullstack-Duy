using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebCuaDuy.Entities
{
    public class Cart
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }

        // Danh sách hàng trong giỏ
        public List<CartItem> Items { get; set; } = new();

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}