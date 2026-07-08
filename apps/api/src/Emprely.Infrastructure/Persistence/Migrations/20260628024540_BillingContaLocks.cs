using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BillingContaLocks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "billing_conta_locks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    TouchedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_billing_conta_locks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_billing_conta_locks_ContaId",
                table: "billing_conta_locks",
                column: "ContaId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "billing_conta_locks");
        }
    }
}
