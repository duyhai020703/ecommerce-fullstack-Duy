using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebCuaDuy.Entities
{
    public class Category
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public required string Name { get; set; }
        public string? Description { get; set; }

        // Đệ quy: Danh mục con trỏ về danh mục cha (Vd: Áo Thun -> Áo Nam)
        [BsonRepresentation(BsonType.ObjectId)]
        public string? ParentId { get; set; }
    }
}