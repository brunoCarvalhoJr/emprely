using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ClientesConta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "clientes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Telefone = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Documento = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Observacoes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clientes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clientes_contas_ContaId",
                        column: x => x.ContaId,
                        principalTable: "contas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_clientes_ContaId",
                table: "clientes",
                column: "ContaId");

            migrationBuilder.CreateIndex(
                name: "IX_clientes_ContaId_Nome",
                table: "clientes",
                columns: new[] { "ContaId", "Nome" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "clientes");
        }
    }
}
