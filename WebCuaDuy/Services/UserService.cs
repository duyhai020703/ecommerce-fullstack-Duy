using MongoDB.Driver;
using WebCuaDuy.Entities;
using WebCuaDuy.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Net.Http.Json;

namespace WebCuaDuy.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public UserService(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;

            var mongoClient = new MongoClient(config["MongoDB:ConnectionURI"]);
            var database = mongoClient.GetDatabase(config["MongoDB:DatabaseName"]);
            _users = database.GetCollection<User>("Users");
        }

        // --- 1. ĐĂNG KÝ ---
        public async Task RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
            if (existingUser != null) throw new Exception("Email này đã được sử dụng!");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                FullName = request.FullName,
                Role = "Customer"
            };

            await _users.InsertOneAsync(newUser);
        }

        // --- 2. ĐĂNG NHẬP THƯỜNG ---
        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var user = await _users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Sai email hoặc mật khẩu!");
            }

            return new LoginResponse
            {
                Token = GenerateJwtToken(user),
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role
            };
        }

        // --- 3. ĐĂNG NHẬP FACEBOOK ---
        public async Task<LoginResponse> LoginWithFacebookAsync(string fbToken)
        {
            var client = _httpClientFactory.CreateClient();
            var fbRes = await client.GetFromJsonAsync<FacebookUser>(
                $"https://graph.facebook.com/me?fields=id,name,email&access_token={fbToken}");

            if (fbRes == null || string.IsNullOrEmpty(fbRes.Email))
            {
                throw new Exception("Xác thực Facebook thất bại!");
            }

            var user = await _users.Find(u => u.Email == fbRes.Email).FirstOrDefaultAsync();

            if (user == null)
            {
                user = new User
                {
                    Email = fbRes.Email,
                    FullName = fbRes.Name,
                    PasswordHash = "", // MXH không dùng pass nội bộ
                    Role = "Customer"
                };
                await _users.InsertOneAsync(user);
            }

            return new LoginResponse
            {
                Token = GenerateJwtToken(user),
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

            var claims = new[]
            {
                new Claim("id", user.Id ?? ""),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}