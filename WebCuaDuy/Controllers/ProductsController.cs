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
    }
}