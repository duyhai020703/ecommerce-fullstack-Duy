using MongoDB.Driver;
using WebCuaDuy.Entities;
using WebCuaDuy.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WebCuaDuy.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _config; // Để đọc SecretKey

        public UserService(IConfiguration config)
        {
            _config = config;
            var mongoClient = new MongoClient(config["MongoDB:ConnectionURI"]);
            var database = mongoClient.GetDatabase(config["MongoDB:DatabaseName"]);
            _users = database.GetCollection<User>("Users");
        }

        // --- 1. ĐĂNG KÝ ---
        public async Task RegisterAsync(RegisterRequest request)
        {
            // Kiểm tra email đã tồn tại chưa
            var existingUser = await _users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                throw new Exception("Email này đã được sử dụng!");
            }

            // Mã hóa mật khẩu (Hashing)
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Tạo User mới
            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash, // Lưu cái đã mã hóa, KHÔNG lưu pass thường
                FullName = request.FullName,
                Role = "Customer" // Mặc định là khách hàng
            };

            await _users.InsertOneAsync(newUser);
        }

        // --- 2. ĐĂNG NHẬP ---
        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            // Tìm user theo email
            var user = await _users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();

            // Check 1: User có tồn tại không?
            // Check 2: Mật khẩu nhập vào có khớp với mã hóa không?
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Sai email hoặc mật khẩu!"); // Thông báo chung chung để bảo mật
            }

            // Nếu đúng hết -> Tạo Token
            string token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role
            };
        }

        // --- HÀM PHỤ: TẠO JWT TOKEN ---
        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Các thông tin đính kèm vào trong Token (Claims)
            var claims = new[]
            {
                new Claim("id", user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1), // Token hết hạn sau 1 ngày
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}