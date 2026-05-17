using Emprely.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Emprely.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(EmprelyDbContext))]
    [Migration("20260516002000_CoresSistemaPerfilConta")]
    public partial class CoresSistemaPerfilConta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CorSistemaPrimaria",
                table: "perfis_conta",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "#6E38FF");

            migrationBuilder.AddColumn<string>(
                name: "CorSistemaSecundaria",
                table: "perfis_conta",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "#13C7BD");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CorSistemaPrimaria",
                table: "perfis_conta");

            migrationBuilder.DropColumn(
                name: "CorSistemaSecundaria",
                table: "perfis_conta");
        }
    }
}
