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
            var cart = await GetCartAsync(userId);

            // Tìm xem món hàng này (cùng ProductID VÀ cùng SKU/Màu) đã có trong giỏ chưa
            var existingItem = cart.Items
                .FirstOrDefault(i => i.ProductId == newItem.ProductId && i.Sku == newItem.Sku);

            if (existingItem != null)
            {
                // Nếu có rồi thì cộng dồn số lượng
                existingItem.Quantity += newItem.Quantity;
            }
            else
            {
                // Nếu chưa có thì thêm mới vào danh sách
                cart.Items.Add(newItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;

            // Lưu đè lại vào MongoDB
            await _cartCollection.ReplaceOneAsync(c => c.Id == cart.Id, cart);
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