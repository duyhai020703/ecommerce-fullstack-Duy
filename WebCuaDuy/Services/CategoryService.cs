using MongoDB.Driver;
using WebCuaDuy.Entities;

namespace WebCuaDuy.Services
{
    public class CategoryService
    {
        private readonly IMongoCollection<Category> _categories;

        public CategoryService(IConfiguration config)
        {
            var mongoClient = new MongoClient(config["MongoDB:ConnectionURI"]);
            var database = mongoClient.GetDatabase(config["MongoDB:DatabaseName"]);
            _categories = database.GetCollection<Category>("Categories");
        }

        public async Task<List<Category>> GetAsync() =>
            await _categories.Find(_ => true).ToListAsync();

        public async Task CreateAsync(Category category) =>
            await _categories.InsertOneAsync(category);

        // Hàm kiểm tra ID có tồn tại không (Dùng cho ProductService gọi)
        public async Task<bool> ExistsAsync(string id) =>
            await _categories.Find(c => c.Id == id).AnyAsync();
    }
}