using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebCuaDuy.Entities
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [BsonRepresentation(BsonType.String)]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        // Lưu địa chỉ giao hàng cứng vào đây (Snapshot)
        public Address ShippingAddress { get; set; }

        // Danh sách hàng mua (Snapshot giá và tên)
        public List<OrderItem> Items { get; set; } = new();

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal TotalAmount { get; set; } // Tổng tiền đơn hàng

        public string? Note { get; set; } // Ghi chú của khách
    }
}