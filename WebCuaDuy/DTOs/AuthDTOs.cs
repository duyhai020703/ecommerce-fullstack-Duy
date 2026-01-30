namespace WebCuaDuy.DTOs
{
    // 1. Dữ liệu khách gửi lên khi Đăng ký
    public class RegisterRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FullName { get; set; }
    }

    // 2. Dữ liệu khách gửi lên khi Đăng nhập
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    // 3. Dữ liệu Server trả về khi đăng nhập thành công
    public class LoginResponse
    {
        public string Token { get; set; } // Cái vé vào cửa
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }
}