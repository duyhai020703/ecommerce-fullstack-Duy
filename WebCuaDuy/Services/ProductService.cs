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
        public async Task<List<Product>> GetAsync()
        {
            // 1. Lấy tất cả sản phẩm
            var products = await _products.Find(_ => true).ToListAsync();

            // 2. Gọi CategoryService để lấy tất cả danh mục
            // (Giả sử bạn đã viết hàm GetAllAsync() bên CategoryService)
            var categories = await _categoryService.GetAsync();

            // 3. Khớp tên danh mục vào sản phẩm
            foreach (var p in products)
            {
                p.CategoryName = categories.FirstOrDefault(c => c.Id == p.CategoryId)?.Name;
            }

            return products;
        }
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
        // Thêm hàm này vào trong class ProductService
        public async Task UpdateAsync(string id, Product updatedProduct)
        {
            // 1. Cập nhật lại Slug nếu tên sản phẩm thay đổi
            if (!string.IsNullOrEmpty(updatedProduct.Name))
            {
                updatedProduct.Slug = updatedProduct.Name.ToLower().Replace(" ", "-");
                // Bạn có thể dùng thư viện để bỏ dấu tiếng Việt chuẩn hơn ở đây
            }

            // 2. Kiểm tra CategoryId mới có hợp lệ không
            bool catExists = await _categoryService.ExistsAsync(updatedProduct.CategoryId);
            if (!catExists) throw new Exception("Danh mục không tồn tại!");

            // 3. Đảm bảo các biến thể mới đều có SKU
            if (updatedProduct.Variants != null)
            {
                foreach (var v in updatedProduct.Variants)
                {
                    if (string.IsNullOrEmpty(v.Sku))
                        v.Sku = $"{updatedProduct.Slug}-{v.Color}-{v.Size}".ToUpper();
                }
            }

            // 4. Thực hiện cập nhật vào MongoDB
            // Lệnh này tìm bản ghi có Id cũ và thay bằng object updatedProduct mới
            await _products.ReplaceOneAsync(p => p.Id == id, updatedProduct);
        }
        public async Task<bool> DeleteAsync(string id)
        {
            // Tìm và xóa sản phẩm có Id trùng khớp
            var result = await _products.DeleteOneAsync(product => product.Id == id);

            // Trả về True nếu xóa được ít nhất 1 dòng, False nếu không tìm thấy ID
            return result.DeletedCount > 0;
        }
    }
}