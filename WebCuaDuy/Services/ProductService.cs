using MongoDB.Driver;
using WebCuaDuy.Entities;

namespace WebCuaDuy.Services
{
    public class ProductService
    {
        private readonly IMongoCollection<Product> _products;
        private readonly CategoryService _categoryService; // Gọi service khác để check

        public ProductService(IConfiguration config, CategoryService categoryService)
        {
            var mongoClient = new MongoClient(config["MongoDB:ConnectionURI"]);
            var database = mongoClient.GetDatabase(config["MongoDB:DatabaseName"]);
            _products = database.GetCollection<Product>("Products");

            _categoryService = categoryService;
        }

        public async Task<List<Product>> GetAsync() =>
            await _products.Find(_ => true).ToListAsync();

        public async Task<Product> GetByIdAsync(string id) =>
            await _products.Find(p => p.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Product product)
        {
            // 1. Logic tạo Slug tự động
            if (string.IsNullOrEmpty(product.Slug))
            {
                // Ví dụ: "Áo Thun Mùa Hè" -> "ao-thun-mua-he"
                // (Đây là cách đơn giản, thực tế nên dùng thư viện để bỏ dấu tiếng Việt)
                product.Slug = product.Name.ToLower().Replace(" ", "-");
            }
            // CHECK 1: Validate CategoryId
            bool catExists = await _categoryService.ExistsAsync(product.CategoryId);
            if (!catExists) throw new Exception("Danh mục không tồn tại!");

            // CHECK 2: Nếu có Variants, tự động tạo SKU nếu chưa có (Optional)
            foreach (var v in product.Variants)
            {
                if (string.IsNullOrEmpty(v.Sku))
                    v.Sku = $"{product.Slug}-{v.Color}-{v.Size}".ToUpper();
            }

            product.CreatedAt = DateTime.UtcNow;
            await _products.InsertOneAsync(product);
        }
        // 👇 THÊM HÀM NÀY VÀO
        public async Task<bool> DeleteAsync(string id)
        {
            // Tìm và xóa sản phẩm có Id trùng khớp
            var result = await _products.DeleteOneAsync(product => product.Id == id);

            // Trả về True nếu xóa được ít nhất 1 dòng, False nếu không tìm thấy ID
            return result.DeletedCount > 0;
        }
    }
}