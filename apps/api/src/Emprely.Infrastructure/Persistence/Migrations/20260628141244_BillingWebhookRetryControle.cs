using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BillingWebhookRetryControle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ProximaTentativaAt",
                table: "eventos_webhook_pagamento",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TentativasProcessamento",
                table: "eventos_webhook_pagamento",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProximaTentativaAt",
                table: "eventos_webhook_pagamento");

            migrationBuilder.DropColumn(
                name: "TentativasProcessamento",
                table: "eventos_webhook_pagamento");
        }
    }
}
