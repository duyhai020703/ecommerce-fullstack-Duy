using Microsoft.AspNetCore.Mvc;
using WebCuaDuy.Entities;
using WebCuaDuy.Services;

namespace WebCuaDuy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _service;
        public CategoryController(CategoryService service) => _service = service;

        [HttpGet]
        public async Task<List<Category>> Get() => await _service.GetAsync();

        [HttpPost]
        public async Task<IActionResult> Create(Category category)
        {
            await _service.CreateAsync(category);
            return Ok(category);
        }
        // Thêm các hàm này vào bên trong class CategoryController

        // Cập nhật Category
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Category updatedCategory)
        {
            var category = await _service.GetByIdAsync(id);
            if (category == null) return NotFound("Không tìm thấy danh mục này!");

            updatedCategory.Id = category.Id; // Đảm bảo ID không bị thay đổi
            await _service.UpdateAsync(id, updatedCategory);
            return NoContent(); // Trả về 204 (Thành công nhưng không kèm nội dung)
        }

        // Xóa Category
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var category = await _service.GetByIdAsync(id);
            if (category == null) return NotFound("Không tìm thấy danh mục để xóa!");

            await _service.DeleteAsync(id);
            return Ok(new { message = "Đã xóa danh mục thành công!" });
        }
    }
}