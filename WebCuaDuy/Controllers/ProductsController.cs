using Microsoft.AspNetCore.Mvc;
using WebCuaDuy.Entities;
using WebCuaDuy.Services;

namespace WebCuaDuy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _service;
        public ProductController(ProductService service) => _service = service;

        [HttpGet]
        public async Task<List<Product>> Get() => await _service.GetAsync();

        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            try
            {
                await _service.CreateAsync(product);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")] // ⚠️ QUAN TRỌNG: Phải có ("{id}") để khớp với URL api/Product/xxxx
        public async Task<IActionResult> Delete(string id) // ⚠️ Lưu ý: MongoDB dùng string id, không phải int
        {
            var isDeleted = await _service.DeleteAsync(id);

            if (isDeleted)
            {
                return Ok(new { message = "Xóa thành công!" });
            }
            else
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này để xóa." });
            }
        }
        // Thêm hàm này vào trong class ProductController
        [HttpPut("{id}")] // URL sẽ có dạng: api/Product/697dc99...
        public async Task<IActionResult> Update(string id, Product updatedProduct)
        {
            try
            {
                // Kiểm tra ID trong URL và ID trong object có khớp nhau không (bảo mật)
                // Nếu object gửi lên chưa có ID, hãy gán ID từ URL vào
                if (string.IsNullOrEmpty(updatedProduct.Id))
                {
                    updatedProduct.Id = id;
                }

                var existingProduct = await _service.GetByIdAsync(id);
                if (existingProduct == null)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm để cập nhật." });
                }

                await _service.UpdateAsync(id, updatedProduct);
                return Ok(new { message = "Cập nhật sản phẩm thành công!", data = updatedProduct });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}