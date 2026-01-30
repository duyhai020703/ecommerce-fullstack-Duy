using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebCuaDuy.Entities
{
    // 1. Địa chỉ giao hàng (Dùng trong User và Order)
    public class Address
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
    }

    // 2. Biến thể sản phẩm (Màu sắc, Size)
    public class ProductVariant
    {
        public string Sku { get; set; } // Mã kho: Vd "AO-TRANG-L"
        public string Color { get; set; }
        public string Size { get; set; }
        public int StockQuantity { get; set; } // Tồn kho của màu này
    }

    // 3. Item trong Giỏ hàng (Chưa cần lưu giá, vì giá lấy theo thời gian thực)
    public class CartItem
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProductId { get; set; }
        public string Sku { get; set; } // Lưu SKU để biết khách chọn màu nào
        public int Quantity { get; set; }
    }

    // 4. Item trong Đơn hàng (QUAN TRỌNG: Phải lưu giá cứng - Snapshot)
    public class OrderItem
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProductId { get; set; }

        public string ProductName { get; set; } // Lưu tên lúc mua
        public string Sku { get; set; }
        public int Quantity { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Price { get; set; } // Giá TẠI THỜI ĐIỂM MUA
    }

    // 5. Trạng thái đơn hàng
    public enum OrderStatus
    {
        Pending,    // Chờ xử lý
        Confirmed,  // Đã xác nhận
        Shipping,   // Đang giao
        Delivered,  // Đã giao
        Cancelled   // Đã hủy
    }
}