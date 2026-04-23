# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Sửa lại tên file .csproj cho đúng với project của Duy
COPY ["WebCuaDuy.csproj", "./"]
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
# Duy kiểm tra lại nếu file chạy chính tên là WebCuaDuy.dll thì giữ nguyên nhé
ENTRYPOINT ["dotnet", "WebCuaDuy.dll"]