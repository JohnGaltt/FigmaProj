using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.IO;
using System.Reflection;

namespace WebAppSignalR.Swagger
{
    public static class Extensions
    {
        public static IServiceCollection AddCustomSwagger(this IServiceCollection services, string serviceTitle)
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }
           
            services.AddSwaggerGen(cfg =>
            {
                cfg.DescribeAllEnumsAsStrings();
                cfg.DescribeStringEnumsInCamelCase();
                cfg.CustomSchemaIds(schema => schema.FullName);

                cfg.SwaggerDoc("v1", new Info { Title = serviceTitle, Version = "v1" });

                var xmlFile = $"{Assembly.GetEntryAssembly().GetName().Name}.xml";
                cfg.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFile));
            });

            return services;
        }

        public static IApplicationBuilder UseCustomSwagger(this IApplicationBuilder app)
        {
            IConfiguration configuration = app.ApplicationServices.GetService<IConfiguration>();
            string basePath = configuration["BasePath"] ?? "";
            app.UseSwagger(options =>
            {
                options.PreSerializeFilters.Add((swaggerDoc, httpReq) => swaggerDoc.BasePath = basePath);
                options.RouteTemplate = "/{documentName}/swagger.json";
            })
            .UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint($"{basePath}/v1/swagger.json", "V1");
                c.DefaultModelExpandDepth(0);
                c.DefaultModelsExpandDepth(-1);
            });

            return app;
        }
    }
}
