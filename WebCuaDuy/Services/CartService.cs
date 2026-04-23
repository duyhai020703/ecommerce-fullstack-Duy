using MongoDB.Driver;
using WebCuaDuy.Entities;

namespace WebCuaDuy.Services
{
    public class CartService
    {
        private readonly IMongoCollection<Cart> _cartCollection;

        public CartService(IConfiguration config)
        {
            var mongoClient = new MongoClient(config["MongoDB:ConnectionURI"]);
            var database = mongoClient.GetDatabase(config["MongoDB:DatabaseName"]);
            _cartCollection = database.GetCollection<Cart>("Carts");
        }

        // 1. Lấy giỏ hàng của User (Nếu chưa có thì tự tạo mới)
        public async Task<Cart> GetCartAsync(string userId)
        {
            var cart = await _cartCollection.Find(c => c.UserId == userId).FirstOrDefaultAsync();

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    Items = new List<CartItem>(),
                    UpdatedAt = DateTime.UtcNow
                };
                await _cartCollection.InsertOneAsync(cart);
            }
            return cart;
        }

        // 2. Thêm vào giỏ
        public async Task AddToCartAsync(string userId, CartItem newItem)
        {
            // 1. Tạo Filter để tìm đúng User và đúng Sản phẩm trong giỏ (đúng SKU)
            // Duy dùng Filter.Eq thay vì viết Lambda trực tiếp trong ElemMatch sẽ an toàn hơn
            var filter = Builders<Cart>.Filter.And(
                Builders<Cart>.Filter.Eq(c => c.UserId, userId),
                Builders<Cart>.Filter.ElemMatch(c => c.Items,
                    Builders<CartItem>.Filter.And(
                        Builders<CartItem>.Filter.Eq(i => i.ProductId, newItem.ProductId),
                        Builders<CartItem>.Filter.Eq(i => i.Sku, newItem.Sku)
                    )
                )
            );

            var cart = await _cartCollection.Find(filter).FirstOrDefaultAsync();

            if (cart != null)
            {
                // 2. Nếu đã có: Dùng $inc để tăng số lượng (Items.$.Quantity nghĩa là phần tử vừa tìm thấy)
                var update = Builders<Cart>.Update.Inc("Items.$.Quantity", newItem.Quantity)
                                                  .Set(c => c.UpdatedAt, DateTime.UtcNow);
                await _cartCollection.UpdateOneAsync(filter, update);
            }
            else
            {
                // 3. Nếu chưa có: Thêm mới vào mảng Items
                // SỬA LỖI Ở ĐÂY: Tham số đầu tiên phải là filter tìm User
                var userFilter = Builders<Cart>.Filter.Eq(c => c.UserId, userId);

                var pushUpdate = Builders<Cart>.Update.Push(c => c.Items, newItem)
                                                       .Set(c => c.UpdatedAt, DateTime.UtcNow);

                await _cartCollection.UpdateOneAsync(userFilter, pushUpdate);
            }
        }
        // 3. Xóa sản phẩm khỏi giỏ
        public async Task RemoveFromCartAsync(string userId, string productId, string sku)
        {
            var cart = await GetCartAsync(userId);

            // Tìm và xóa item khớp cả ID lẫn SKU
            var itemToRemove = cart.Items
                .FirstOrDefault(i => i.ProductId == productId && i.Sku == sku);

            if (itemToRemove != null)
            {
                cart.Items.Remove(itemToRemove);
                await _cartCollection.ReplaceOneAsync(c => c.Id == cart.Id, cart);
            }
        }

        // 4. Xóa sạch giỏ (Dùng khi đã Đặt hàng xong)
        public async Task ClearCartAsync(string userId)
        {
            var update = Builders<Cart>.Update.Set(c => c.Items, new List<CartItem>());
            await _cartCollection.UpdateOneAsync(c => c.UserId == userId, update);
        }
    }
}