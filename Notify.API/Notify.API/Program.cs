using Notify.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPermission", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:3000", "http://192.168.56.1:3000", "http://127.0.0.1:3000")
            .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddSignalR().AddAzureSignalR("Endpoint=https://studyclix-test.service.signalr.net;AccessKey=t2++WBjHKX2aNg0BcBNvHKs9thC/YrBGiNXzEAtCkHo=;Version=1.0;");

var app = builder.Build();

app.UseCors("ClientPermission");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    app.MapControllers();
    endpoints.MapHub<NotificationHub>("/hubs/notifications");
});



app.Run();
