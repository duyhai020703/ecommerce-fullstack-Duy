using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebCuaDuy.Entities;
using WebCuaDuy.Services;

namespace WebCuaDuy.Controllers
{
    [Authorize] // <--- BẮT BUỘC PHẢI ĐĂNG NHẬP
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService) => _cartService = cartService;

        // Hàm lấy ID từ Token
        private string GetMyUserId()
        {
            return User.FindFirst("id")?.Value;
        }

        [HttpGet]
        public async Task<Cart> GetMyCart()
        {
            return await _cartService.GetCartAsync(GetMyUserId());
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartItem item)
        {
            await _cartService.AddToCartAsync(GetMyUserId(), item);
            return Ok(new { message = "Đã thêm vào giỏ hàng thành công!" });
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> Remove(string productId, string sku)
        {
            await _cartService.RemoveFromCartAsync(GetMyUserId(), productId, sku);
            return Ok(new { message = "Đã xóa sản phẩm khỏi giỏ!" });
        }
    }
}