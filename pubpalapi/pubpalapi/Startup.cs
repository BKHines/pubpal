using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using pubpalapi.Core;
using PubPalAPI.Models;

namespace pubpalapi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddAuthentication(o =>
            {
                o.DefaultScheme = Constants.SchemesNamesConst;
            }).AddScheme<TokenAuthenticationOptions, PubPalAuthenticationHandler>(Constants.SchemesNamesConst, o => { });
            services.AddAuthorization();
            services.AddCors(options =>
            {
                options.AddPolicy("PubPalCORS", builder => builder.WithOrigins("http://localhost:4200",
                                                                                "https://localhost:4200")
                                                            .AllowAnyHeader()
                                                            .AllowAnyMethod());
            });
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddScoped<PubPalInterceptor>();
            services.AddOptions();

            services.Configure<SettingsModel>(options =>
            {
                options.IsDev = Configuration.GetSection("Settings").GetValue<bool>("IsDev");
                options.ConnectionString = Configuration.GetSection("Settings").GetValue<string>("ConnectionString");
                options.Database = Configuration.GetSection("Settings").GetValue<string>("Database");
                options.UserStoreName = Configuration.GetSection("Settings").GetValue<string>("UserStoreName");
                options.SellerStoreName = Configuration.GetSection("Settings").GetValue<string>("SellerStoreName");
            });

            // Register the Swagger services
            services.AddSwaggerDocument();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("PubPalCORS");

            app.UseStaticFiles();
            app.UseMiddleware<PubPalAPIResponseWrapper>();

            // Register the Swagger generator and the Swagger UI middlewares
            app.UseOpenApi();
            app.UseSwaggerUi3();
            app.UseMvc();
        }
    }
}
