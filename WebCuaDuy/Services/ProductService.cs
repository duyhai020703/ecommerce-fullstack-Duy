using MongoDB.Driver;
using Server.Entities; // Nhớ đổi cho đúng namespace của bạn

namespace Server.Services
{
    public class ProductService
    {
        private readonly IMongoCollection<Product> _productsCollection;

        public ProductService(IConfiguration config)
        {
            // Đọc cấu hình từ appsettings.json để kết nối
            var mongoClient = new MongoClient(config["MongoDB:ConnectionURI"]);
            var mongoDatabase = mongoClient.GetDatabase(config["MongoDB:DatabaseName"]);

            _productsCollection = mongoDatabase.GetCollection<Product>("Products");
        }

        // Lấy tất cả sản phẩm
        public async Task<List<Product>> GetAsync() =>
            await _productsCollection.Find(_ => true).ToListAsync();

        // Lấy 1 sản phẩm theo ID
        public async Task<Product?> GetAsync(string id) =>
            await _productsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Thêm sản phẩm mới
        public async Task CreateAsync(Product newProduct) =>
            await _productsCollection.InsertOneAsync(newProduct);

        // Xóa sản phẩm
        public async Task RemoveAsync(string id) =>
            await _productsCollection.DeleteOneAsync(x => x.Id == id);
    }
}