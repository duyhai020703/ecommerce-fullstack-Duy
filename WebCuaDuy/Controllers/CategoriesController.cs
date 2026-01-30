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
    }
}